import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Project {
  id: string;
  businessName: string;
  customerName: string;
  customerNumber: string;
  startingDate: string;
  deliveryDate: string;
  status: string;
  statusHistory: Array<{
    phase: string;
    timestamp: string;
    notes?: string;
  }>;
  createdAt: string;
}

const ProjectTracking = () => {
  const navigate = useNavigate();
  const [projectId, setProjectId] = useState('');
  const [project, setProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState('');

  // Load projects from localStorage on component mount
  useEffect(() => {
    const savedProjects = localStorage.getItem('projects');
    if (savedProjects) {
      const parsedProjects = JSON.parse(savedProjects);
      setProjects(parsedProjects);
      console.log('Loaded projects from localStorage:', parsedProjects);
    } else {
      console.log('No projects found in localStorage');
    }
  }, []);

  const handleTrackProject = () => {
    if (!projectId.trim()) {
      setError('Please enter a project ID');
      setProject(null);
      return;
    }

    console.log('Searching for Project ID:', projectId.trim());
    console.log('Available projects:', projects);
    
    const foundProject = projects.find(p => p.id === projectId.trim());
    if (foundProject) {
      setProject(foundProject);
      setError('');
      console.log('Project found:', foundProject);
    } else {
      setProject(null);
      setError('Project not found. Please check your Project ID and try again.');
      console.log('Project not found. Available IDs:', projects.map(p => p.id));
    }
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'Project Confirmed': 'bg-blue-500',
      'Designing Phase': 'bg-purple-500',
      'Development Phase': 'bg-yellow-500',
      'Pre-Production Testing Phase': 'bg-orange-500',
      'Final Testing Phase': 'bg-red-500',
      'Final Confirmation': 'bg-indigo-500',
      'Project Completed': 'bg-green-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  const getPhaseNumber = (phase: string) => {
    const phases = [
      'Project Confirmed',
      'Designing Phase',
      'Development Phase',
      'Pre-Production Testing Phase',
      'Final Testing Phase',
      'Final Confirmation',
      'Project Completed'
    ];
    return phases.indexOf(phase) + 1;
  };

  const getProgressPercentage = () => {
    if (!project) return 0;
    const currentPhase = getPhaseNumber(project.status);
    return (currentPhase / 7) * 100;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      {/* Header */}
      <div className="bg-black/50 backdrop-blur-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Project Tracking</h1>
              <p className="text-white/70 mt-1">Monitor your project progress in real-time</p>
            </div>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors duration-200"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Project ID Input Section */}
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 mb-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-3">Enter Your Project ID</h2>
            <p className="text-white/70 max-w-2xl mx-auto">
              Your Project ID is your <strong>unique access key</strong> to track project progress. 
              This ID was provided by your project manager when the project was created.
            </p>
          </div>
          
          <div className="max-w-md mx-auto space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Project ID
              </label>
                             <input
                 type="text"
                 value={projectId}
                 onChange={(e) => setProjectId(e.target.value)}
                 placeholder="Enter your Project ID (e.g., PRJ-001, WEB-2024-001)"
                 className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center font-mono"
                 onKeyPress={(e) => e.key === 'Enter' && handleTrackProject()}
               />
            </div>
            
            <button
              onClick={handleTrackProject}
              className="w-full py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-medium transition-colors duration-200"
            >
              Track Project
            </button>
          </div>

          {error && (
            <div className="mt-4 text-center">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}
        </div>

        {/* Project Details Section */}
        {project && (
          <div className="space-y-8">
            
                         {/* Project Overview */}
             <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
               <h3 className="text-xl font-bold text-white mb-4">Project Overview</h3>
               
               {/* Project ID - Prominent Display */}
               <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6">
                 <div className="flex items-center justify-between">
                   <div>
                     <p className="text-blue-400 text-sm font-medium mb-1">Your Project ID</p>
                     <p className="text-white font-mono font-bold text-lg">{project.id}</p>
                   </div>
                   <button
                     onClick={() => {
                       navigator.clipboard.writeText(project.id);
                       alert('Project ID copied to clipboard!');
                     }}
                     className="px-3 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white text-sm transition-colors"
                     title="Copy Project ID"
                   >
                     Copy ID
                   </button>
                 </div>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div>
                   <p className="text-white/70 text-sm">Current Status</p>
                   <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
                     {project.status}
                   </span>
                 </div>
                <div>
                  <p className="text-white/70 text-sm">Business Name</p>
                  <p className="text-white font-medium">{project.businessName}</p>
                </div>
                <div>
                  <p className="text-white/70 text-sm">Customer Name</p>
                  <p className="text-white font-medium">{project.customerName}</p>
                </div>
                <div>
                  <p className="text-white/70 text-sm">Start Date</p>
                  <p className="text-white">{new Date(project.startingDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-white/70 text-sm">Delivery Date</p>
                  <p className="text-white">{new Date(project.deliveryDate).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-4">Project Progress</h3>
              
              <div className="mb-4">
                <div className="flex justify-between text-sm text-white/70 mb-2">
                  <span>Progress</span>
                  <span>{Math.round(getProgressPercentage())}%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${getProgressPercentage()}%` }}
                  ></div>
                </div>
              </div>

              {/* Phase Indicators */}
              <div className="grid grid-cols-7 gap-2 mt-6">
                {[
                  'Project Confirmed',
                  'Designing Phase',
                  'Development Phase',
                  'Pre-Production Testing Phase',
                  'Final Testing Phase',
                  'Final Confirmation',
                  'Project Completed'
                ].map((phase, index) => {
                  const isCompleted = getPhaseNumber(project.status) >= index + 1;
                  const isCurrent = project.status === phase;
                  
                  return (
                    <div key={phase} className="text-center">
                      <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center text-xs font-bold ${
                        isCompleted 
                          ? 'bg-green-500 text-white' 
                          : isCurrent 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-white/20 text-white/50'
                      }`}>
                        {index + 1}
                      </div>
                      <p className={`text-xs mt-2 ${isCompleted ? 'text-white' : 'text-white/50'}`}>
                        {phase.split(' ')[0]}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Status History */}
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-4">Status History</h3>
              
              <div className="space-y-4">
                {project.statusHistory.map((status, index) => (
                  <div key={index} className="flex items-start space-x-4 p-4 bg-white/5 rounded-lg">
                    <div className={`w-3 h-3 rounded-full mt-2 ${getStatusColor(status.phase)}`}></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-white">{status.phase}</h4>
                        <span className="text-sm text-white/50">
                          {new Date(status.timestamp).toLocaleString()}
                        </span>
                      </div>
                      {status.notes && (
                        <p className="text-sm text-white/70">{status.notes}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-4">Need Help?</h3>
              <p className="text-white/70 mb-4">
                If you have any questions about your project or need assistance, please don't hesitate to contact us.
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => navigate('/contact')}
                  className="px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg font-medium transition-colors duration-200"
                >
                  Contact Support
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg font-medium transition-colors duration-200"
                >
                  Back to Home
                </button>
              </div>
            </div>
          </div>
        )}

                {/* Instructions for New Users */}
        {!project && !error && (
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 text-center">
            <h3 className="text-xl font-bold text-white mb-4">How to Track Your Project</h3>
            <div className="space-y-4 text-white/70">
              <p>1. Enter your Project ID in the field above</p>
              <p>2. Click "Track Project" to view your project status</p>
              <p>3. Monitor progress through all 7 phases</p>
              <p>4. View detailed status history and updates</p>
            </div>
            <div className="mt-6">
              <p className="text-sm text-white/50">
                Don't have a Project ID? Contact your project manager or support team.
              </p>
            </div>
            
            {/* Project ID Information Box */}
            <div className="mt-6 bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 text-left">
              <h4 className="font-semibold text-blue-400 mb-2">About Project ID</h4>
              <div className="text-sm text-white/70 space-y-2">
                <p><strong>Format:</strong> Custom format (e.g., PRJ-001, WEB-2024-001)</p>
                <p><strong>Purpose:</strong> Unique identifier for your specific project</p>
                <p><strong>Source:</strong> Provided by your project manager when project is created</p>
                <p><strong>Security:</strong> Keep this ID private - it's your access key to project information</p>
              </div>
            </div>

            {/* Debug Section - Show Available Projects */}
            {projects.length > 0 && (
              <div className="mt-6 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 text-left">
                <h4 className="font-semibold text-yellow-400 mb-2">Debug: Available Projects</h4>
                <div className="text-sm text-white/70 space-y-2">
                  <p><strong>Total Projects:</strong> {projects.length}</p>
                  <p><strong>Project IDs:</strong></p>
                  <ul className="list-disc list-inside space-y-1">
                    {projects.map(project => (
                      <li key={project.id} className="font-mono">
                        {project.id} - {project.businessName}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectTracking;
