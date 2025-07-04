import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { Building2, DollarSign, Mail, Star } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Client {
  id: string;
  name: string;
  email: string;
  company: string;
  industry: string;
  budget_range: string;
  project_description: string;
  required_services: string;
  services_needed: string[];
  description: string;
  matchScore?: number;
}

const Clients = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [clients, setClients] = useState<Client[]>([]);
  const [userSkills, setUserSkills] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      // Fetch user skills
      const { data: userData } = await supabase
        .from('users')
        .select('skills, services_offered')
        .eq('id', user.id)
        .single();

      const skills = userData?.skills ? userData.skills.split(',').map(s => s.trim().toLowerCase()) : [];
      const services = userData?.services_offered ? userData.services_offered.split(',').map(s => s.trim().toLowerCase()) : [];
      const allSkills = [...skills, ...services];
      setUserSkills(allSkills);

      // Fetch clients
      const { data: clientsData } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

      if (clientsData) {
        // Calculate match scores
        const clientsWithScores = clientsData.map(client => {
          const requiredServices = client.services_needed || [];
          const matchingServices = requiredServices.filter(service => 
            allSkills.some(skill => 
              skill.includes(service.toLowerCase()) || service.toLowerCase().includes(skill)
            )
          );
          
          const matchScore = requiredServices.length > 0 
            ? (matchingServices.length / requiredServices.length) * 100 
            : 0;

          return { ...client, matchScore };
        });

        // Sort by match score and take top 3
        clientsWithScores.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
        setClients(clientsWithScores.slice(0, 3));
      }

      setLoading(false);
    };

    fetchData();
  }, [user]);

  const generateProposal = async (client: Client) => {
    if (!user) return;

    try {
      // Get user profile for proposal generation
      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (!userData) {
        toast({
          title: "Profile incomplete",
          description: "Please complete your profile first to generate proposals.",
          variant: "destructive",
        });
        navigate('/profile');
        return;
      }

      // Generate proposal text
      const proposalText = `Dear ${client.name || 'Client'},

I am excited about your ${client.project_description} project. With my expertise in ${userData.skills}, I am confident I can deliver exceptional results.

My relevant experience includes:
${userData.work_history}

Services I can provide for this project:
${userData.services_offered}

Based on your requirements for ${client.services_needed?.join(', ')}, I believe my skills in ${userData.skills} make me an ideal fit for this project.

My estimated rate for this project would be ${userData.rate_estimate}, and I am committed to delivering high-quality work within your timeline.

I would love to discuss this opportunity further and answer any questions you may have.

Best regards,
${userData.full_name}
${userData.email}
${userData.phone}`;

      // Save proposal to database
      const { error } = await supabase
        .from('proposals')
        .insert({
          user_id: user.id,
          client_id: client.id,
          proposal_text: proposalText,
          estimated_rate: userData.rate_estimate,
          status: 'draft'
        });

      if (error) {
        toast({
          title: "Error generating proposal",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Proposal generated!",
          description: "Your proposal has been created and saved as a draft.",
        });
        navigate('/proposals');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate proposal. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="flex justify-center">Loading clients...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Client Matches</h1>
        <p className="text-muted-foreground">Top 3 clients that match your skills and services</p>
      </div>

      {clients.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-muted-foreground">No clients found matching your skills.</p>
              <Button 
                className="mt-4" 
                onClick={() => navigate('/profile')}
              >
                Update Your Skills
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {clients.map((client, index) => (
            <Card key={client.id} className="relative">
              <div className="absolute top-4 right-4">
                <Badge variant={index === 0 ? "default" : "secondary"}>
                  <Star className="w-3 h-3 mr-1" />
                  {Math.round(client.matchScore || 0)}% match
                </Badge>
              </div>
              
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  {client.name || 'Anonymous Client'}
                </CardTitle>
                <CardDescription>
                  {client.company && `${client.company} • `}
                  {client.industry}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Project Description</h4>
                  <p className="text-sm text-muted-foreground">
                    {client.project_description || client.description}
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium mb-2">Required Services</h5>
                    <div className="flex flex-wrap gap-1">
                      {client.services_needed?.map((service, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h5 className="font-medium mb-2 flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      Budget Range
                    </h5>
                    <p className="text-sm font-medium">{client.budget_range || 'Not specified'}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    {client.email}
                  </div>
                  
                  <Button onClick={() => generateProposal(client)}>
                    Generate Proposal
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Clients;