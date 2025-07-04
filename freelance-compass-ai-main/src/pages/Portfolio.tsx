import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { Plus, Calendar, ExternalLink, Edit, Trash2 } from 'lucide-react';

interface PortfolioItem {
  id: string;
  project_name: string;
  description: string;
  client_name: string;
  project_date: string | null;
  technologies: string[];
  image_url: string | null;
  impact_results: string;
  created_at: string;
}

const Portfolio = () => {
  const { user } = useAuth();
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [formData, setFormData] = useState({
    project_name: '',
    description: '',
    client_name: '',
    project_date: '',
    technologies: '',
    image_url: '',
    impact_results: ''
  });

  useEffect(() => {
    fetchPortfolioItems();
  }, [user]);

  const fetchPortfolioItems = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('portfolio_items')
      .select('*')
      .eq('user_id', user.id)
      .order('project_date', { ascending: false });

    if (data) {
      setPortfolioItems(data);
    }
    setLoading(false);
  };

  const resetForm = () => {
    setFormData({
      project_name: '',
      description: '',
      client_name: '',
      project_date: '',
      technologies: '',
      image_url: '',
      impact_results: ''
    });
    setEditingItem(null);
  };

  const handleSubmit = async () => {
    if (!user) return;

    const technologiesArray = formData.technologies
      .split(',')
      .map(tech => tech.trim())
      .filter(tech => tech.length > 0);

    const dataToSubmit = {
      ...formData,
      technologies: technologiesArray,
      project_date: formData.project_date || null,
      user_id: user.id
    };

    let error;
    if (editingItem) {
      const result = await supabase
        .from('portfolio_items')
        .update(dataToSubmit)
        .eq('id', editingItem.id);
      error = result.error;
    } else {
      const result = await supabase
        .from('portfolio_items')
        .insert(dataToSubmit);
      error = result.error;
    }

    if (error) {
      toast({
        title: "Error saving portfolio item",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: editingItem ? "Portfolio item updated" : "Portfolio item added",
        description: "Your portfolio has been updated successfully.",
      });
      resetForm();
      setShowAddDialog(false);
      fetchPortfolioItems();
    }
  };

  const handleEdit = (item: PortfolioItem) => {
    setFormData({
      project_name: item.project_name,
      description: item.description || '',
      client_name: item.client_name || '',
      project_date: item.project_date || '',
      technologies: item.technologies.join(', '),
      image_url: item.image_url || '',
      impact_results: item.impact_results || ''
    });
    setEditingItem(item);
    setShowAddDialog(true);
  };

  const handleDelete = async (itemId: string) => {
    const { error } = await supabase
      .from('portfolio_items')
      .delete()
      .eq('id', itemId);

    if (error) {
      toast({
        title: "Error deleting portfolio item",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Portfolio item deleted",
        description: "The item has been removed from your portfolio.",
      });
      fetchPortfolioItems();
    }
  };

  if (loading) {
    return <div className="flex justify-center">Loading portfolio...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Portfolio</h1>
          <p className="text-muted-foreground">Showcase your best work and projects</p>
        </div>
        
        <Dialog 
          open={showAddDialog} 
          onOpenChange={(open) => {
            setShowAddDialog(open);
            if (!open) resetForm();
          }}
        >
          <DialogTrigger asChild>
            <Button className="self-start sm:self-center">
              <Plus className="w-4 h-4 mr-2" />
              Add Project
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? 'Edit Portfolio Item' : 'Add Portfolio Item'}
              </DialogTitle>
              <DialogDescription>
                {editingItem ? 'Update your project details' : 'Add a new project to your portfolio'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="project_name">Project Name</Label>
                  <Input
                    id="project_name"
                    value={formData.project_name}
                    onChange={(e) => setFormData({ ...formData, project_name: e.target.value })}
                    placeholder="Project title"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client_name">Client Name</Label>
                  <Input
                    id="client_name"
                    value={formData.client_name}
                    onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                    placeholder="Client or company name"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the project, your role, and what was accomplished"
                  rows={3}
                />
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="project_date">Project Date</Label>
                  <Input
                    id="project_date"
                    type="date"
                    value={formData.project_date}
                    onChange={(e) => setFormData({ ...formData, project_date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image_url">Image URL</Label>
                  <Input
                    id="image_url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    placeholder="https://example.com/project-image.jpg"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="technologies">Technologies</Label>
                <Input
                  id="technologies"
                  value={formData.technologies}
                  onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                  placeholder="React, Node.js, PostgreSQL, AWS (comma-separated)"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="impact_results">Impact & Results</Label>
                <Textarea
                  id="impact_results"
                  value={formData.impact_results}
                  onChange={(e) => setFormData({ ...formData, impact_results: e.target.value })}
                  placeholder="Quantifiable results, improvements, or impact achieved"
                  rows={2}
                />
              </div>
              
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmit}>
                  {editingItem ? 'Update' : 'Add'} Project
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {portfolioItems.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-muted-foreground">No portfolio items yet.</p>
              <p className="text-sm text-muted-foreground mb-4">
                Start building your portfolio by adding your best projects.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {portfolioItems.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              {item.image_url && (
                <div className="aspect-video bg-muted">
                  <img 
                    src={item.image_url} 
                    alt={item.project_name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}
              
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {item.project_name}
                      {item.image_url && (
                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                      )}
                    </CardTitle>
                    <CardDescription>
                      {item.client_name && `${item.client_name} • `}
                      {item.project_date && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(item.project_date).toLocaleDateString()}
                        </span>
                      )}
                    </CardDescription>
                  </div>
                  
                  <div className="flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleEdit(item)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {item.description && (
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                )}
                
                {item.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {item.technologies.map((tech, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                )}
                
                {item.impact_results && (
                  <div>
                    <h5 className="font-medium text-sm mb-1">Impact & Results</h5>
                    <p className="text-xs text-muted-foreground">
                      {item.impact_results}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Portfolio;