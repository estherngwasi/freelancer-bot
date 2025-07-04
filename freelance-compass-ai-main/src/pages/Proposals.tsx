import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { FileText, Calendar, DollarSign, Eye, Edit, Send } from 'lucide-react';

interface Proposal {
  id: string;
  proposal_text: string;
  estimated_rate: string;
  status: string;
  created_at: string;
  updated_at: string;
  clients: {
    name: string;
    company: string;
    project_description: string;
  } | null;
}

const Proposals = () => {
  const { user } = useAuth();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [editText, setEditText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProposals = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from('proposals')
        .select(`
          *,
          clients (
            name,
            company,
            project_description
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (data) {
        setProposals(data);
      }
      setLoading(false);
    };

    fetchProposals();
  }, [user]);

  const updateProposalStatus = async (proposalId: string, newStatus: string) => {
    const { error } = await supabase
      .from('proposals')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', proposalId);

    if (error) {
      toast({
        title: "Error updating proposal",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Proposal updated",
        description: `Proposal status changed to ${newStatus}.`,
      });
      // Refresh proposals
      setProposals(proposals.map(p => 
        p.id === proposalId ? { ...p, status: newStatus } : p
      ));
    }
  };

  const updateProposalText = async (proposalId: string, newText: string) => {
    const { error } = await supabase
      .from('proposals')
      .update({ proposal_text: newText, updated_at: new Date().toISOString() })
      .eq('id', proposalId);

    if (error) {
      toast({
        title: "Error updating proposal",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Proposal updated",
        description: "Proposal text has been saved.",
      });
      // Refresh proposals
      setProposals(proposals.map(p => 
        p.id === proposalId ? { ...p, proposal_text: newText } : p
      ));
      setSelectedProposal(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'secondary';
      case 'sent': return 'default';
      case 'accepted': return 'default';
      case 'rejected': return 'destructive';
      default: return 'secondary';
    }
  };

  if (loading) {
    return <div className="flex justify-center">Loading proposals...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Proposals</h1>
        <p className="text-muted-foreground">Manage your client proposals and track their status</p>
      </div>

      {proposals.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No proposals yet.</p>
              <p className="text-sm text-muted-foreground mb-4">
                Visit the Clients page to generate proposals for matching projects.
              </p>
              <Button onClick={() => window.location.href = '/clients'}>
                Find Clients
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {proposals.map((proposal) => (
            <Card key={proposal.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      {proposal.clients?.name || 'Unknown Client'}
                    </CardTitle>
                    <CardDescription>
                      {proposal.clients?.company && `${proposal.clients.company} • `}
                      {proposal.clients?.project_description}
                    </CardDescription>
                  </div>
                  <Badge variant={getStatusColor(proposal.status)}>
                    {proposal.status}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Created: {new Date(proposal.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span>Rate: {proposal.estimated_rate || 'Not specified'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Edit className="h-4 w-4 text-muted-foreground" />
                    <span>Updated: {new Date(proposal.updated_at).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Proposal for {proposal.clients?.name}</DialogTitle>
                        <DialogDescription>
                          {proposal.clients?.project_description}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="mt-4">
                        <pre className="whitespace-pre-wrap text-sm bg-muted p-4 rounded-md">
                          {proposal.proposal_text}
                        </pre>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSelectedProposal(proposal);
                          setEditText(proposal.proposal_text);
                        }}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Edit Proposal</DialogTitle>
                        <DialogDescription>
                          Make changes to your proposal text
                        </DialogDescription>
                      </DialogHeader>
                      <div className="mt-4 space-y-4">
                        <Textarea
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          rows={15}
                          className="min-h-[300px]"
                        />
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="outline"
                            onClick={() => setSelectedProposal(null)}
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={() => updateProposalText(proposal.id, editText)}
                          >
                            Save Changes
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Select
                    value={proposal.status}
                    onValueChange={(value) => updateProposalStatus(proposal.id, value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="sent">Sent</SelectItem>
                      <SelectItem value="accepted">Accepted</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>

                  {proposal.status === 'draft' && (
                    <Button 
                      size="sm"
                      onClick={() => updateProposalStatus(proposal.id, 'sent')}
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Send
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Proposals;