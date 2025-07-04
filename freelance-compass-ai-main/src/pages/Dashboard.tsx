import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Clock, Users, FileText, User, Briefcase } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    proposals: 0,
    portfolioItems: 0,
    profileComplete: false,
  });

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;

      const [tasksResult, proposalsResult, portfolioResult, userResult] = await Promise.all([
        supabase.from('tasks').select('status').eq('user_id', user.id),
        supabase.from('proposals').select('id').eq('user_id', user.id),
        supabase.from('portfolio_items').select('id').eq('user_id', user.id),
        supabase.from('users').select('*').eq('id', user.id).single()
      ]);

      const tasks = tasksResult.data || [];
      const completedTasks = tasks.filter(task => task.status === 'completed').length;
      const profileComplete = userResult.data?.full_name && userResult.data?.skills && userResult.data?.job_title;

      setStats({
        totalTasks: tasks.length,
        completedTasks,
        proposals: proposalsResult.data?.length || 0,
        portfolioItems: portfolioResult.data?.length || 0,
        profileComplete: !!profileComplete,
      });
    };

    fetchStats();
  }, [user]);

  const StatCard = ({ title, value, description, icon: Icon, onClick }: any) => (
    <Card className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={onClick}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.user_metadata?.full_name || user?.email}</p>
        </div>
        {!stats.profileComplete && (
          <Badge variant="secondary" className="self-start sm:self-center">
            Complete your profile
          </Badge>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Tasks"
          value={stats.totalTasks}
          description="All your tasks"
          icon={Clock}
          onClick={() => navigate('/tasks')}
        />
        <StatCard
          title="Completed Tasks"
          value={stats.completedTasks}
          description="Tasks finished"
          icon={CheckCircle}
          onClick={() => navigate('/tasks')}
        />
        <StatCard
          title="Proposals"
          value={stats.proposals}
          description="Generated proposals"
          icon={FileText}
          onClick={() => navigate('/proposals')}
        />
        <StatCard
          title="Portfolio Items"
          value={stats.portfolioItems}
          description="Showcase projects"
          icon={Briefcase}
          onClick={() => navigate('/portfolio')}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Get started with common tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => navigate('/profile')}
            >
              <User className="mr-2 h-4 w-4" />
              {stats.profileComplete ? 'Update Profile' : 'Complete Profile'}
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => navigate('/clients')}
            >
              <Users className="mr-2 h-4 w-4" />
              Find Clients
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => navigate('/portfolio')}
            >
              <Briefcase className="mr-2 h-4 w-4" />
              Add Portfolio Item
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Profile Completion</CardTitle>
            <CardDescription>Complete your profile to get better matches</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                {stats.profileComplete ? (
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                ) : (
                  <Clock className="mr-2 h-4 w-4 text-yellow-500" />
                )}
                Profile Information
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: stats.profileComplete ? '100%' : '50%' }}
                />
              </div>
            </div>
            {!stats.profileComplete && (
              <Button 
                className="w-full mt-4" 
                onClick={() => navigate('/profile')}
              >
                Complete Profile
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;