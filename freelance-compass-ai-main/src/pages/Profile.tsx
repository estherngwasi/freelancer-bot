import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    full_name: '',
    email: '',
    phone: '',
    job_title: '',
    skills: '',
    bio_output: '',
    work_history: '',
    education: '',
    certifications: '',
    services_offered: '',
    rate_estimate: '',
    professional_goal: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (data) {
        setProfile({
          full_name: data.full_name || '',
          email: data.email || user.email || '',
          phone: data.phone || '',
          job_title: data.job_title || '',
          skills: data.skills || '',
          bio_output: data.bio_output || '',
          work_history: data.work_history || '',
          education: data.education || '',
          certifications: data.certifications || '',
          services_offered: data.services_offered || '',
          rate_estimate: data.rate_estimate || '',
          professional_goal: data.professional_goal || '',
        });
      }
    };

    fetchProfile();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    const { error } = await supabase
      .from('users')
      .upsert({
        id: user.id,
        ...profile,
      });

    if (error) {
      toast({
        title: "Error updating profile",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Profile updated",
        description: "Your profile has been saved successfully.",
      });
    }

    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Profile</h1>
          <p className="text-muted-foreground">Manage your freelancer profile and information</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Your personal and contact details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  value={profile.full_name}
                  onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="job_title">Job Title</Label>
                <Input
                  id="job_title"
                  value={profile.job_title}
                  onChange={(e) => setProfile({ ...profile, job_title: e.target.value })}
                  placeholder="e.g., Full Stack Developer"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Professional Details</CardTitle>
              <CardDescription>Your skills and services</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="skills">Skills</Label>
                <Textarea
                  id="skills"
                  value={profile.skills}
                  onChange={(e) => setProfile({ ...profile, skills: e.target.value })}
                  placeholder="e.g., React, Node.js, Python, UI/UX Design"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="services_offered">Services Offered</Label>
                <Textarea
                  id="services_offered"
                  value={profile.services_offered}
                  onChange={(e) => setProfile({ ...profile, services_offered: e.target.value })}
                  placeholder="e.g., Web Development, Mobile Apps, Consulting"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rate_estimate">Rate Estimate</Label>
                <Input
                  id="rate_estimate"
                  value={profile.rate_estimate}
                  onChange={(e) => setProfile({ ...profile, rate_estimate: e.target.value })}
                  placeholder="e.g., $50-75/hour"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Background</CardTitle>
            <CardDescription>Your experience and education</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bio_output">Bio</Label>
              <Textarea
                id="bio_output"
                value={profile.bio_output}
                onChange={(e) => setProfile({ ...profile, bio_output: e.target.value })}
                placeholder="Brief description about yourself"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="work_history">Work History</Label>
              <Textarea
                id="work_history"
                value={profile.work_history}
                onChange={(e) => setProfile({ ...profile, work_history: e.target.value })}
                placeholder="Your relevant work experience"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="education">Education</Label>
              <Textarea
                id="education"
                value={profile.education}
                onChange={(e) => setProfile({ ...profile, education: e.target.value })}
                placeholder="Your educational background"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="certifications">Certifications</Label>
              <Textarea
                id="certifications"
                value={profile.certifications}
                onChange={(e) => setProfile({ ...profile, certifications: e.target.value })}
                placeholder="Relevant certifications"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="professional_goal">Professional Goal</Label>
              <Textarea
                id="professional_goal"
                value={profile.professional_goal}
                onChange={(e) => setProfile({ ...profile, professional_goal: e.target.value })}
                placeholder="Your career objectives"
              />
            </div>
          </CardContent>
        </Card>

        <Button type="submit" size="lg" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Profile
        </Button>
      </form>
    </div>
  );
};

export default Profile;