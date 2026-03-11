import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import Header from './Header';
import { ArrowLeft, Play, Book, Code, CheckCircle, XCircle, Lightbulb, Clock, Award, Users, Star, Monitor, Send, Sun, Moon, RotateCcw, Terminal, Copy, Download, Upload, Shield, Activity, Cloud } from 'lucide-react';

interface Lesson {
  id: string;
  title: string;
  content: string;
  codeExample: string;
  exercises: Exercise[];
  terminalCommands?: string[];
}

interface Exercise {
  id: string;
  question: string;
  initialCode: string;
  solution: string;
  hint: string;
  terminalTask?: string;
}

interface CourseModule {
  id: string;
  title: string;
  lessons: Lesson[];
}

const CourseLearningDevOpsAdvanced: React.FC = () => {
  const { courseId, moduleId, lessonId } = useParams();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [currentModule, setCurrentModule] = useState<CourseModule | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'theory' | 'exercise' | 'terminal'>('theory');
  const [currentExerciseId, setCurrentExerciseId] = useState<string | null>(null);
  const [submittedExercises, setSubmittedExercises] = useState<Set<string>>(new Set());
  const [exerciseProgress, setExerciseProgress] = useState<{[key: string]: number}>({});
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const [showFileExplorer, setShowFileExplorer] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  
  // Terminal state
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalHistory, setTerminalHistory] = useState<string[]>([
    'Welcome to Advanced DevOps Terminal!',
    'Type "help" to see available advanced commands.',
    ''
  ]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const terminalRef = useRef<HTMLDivElement>(null);

  // Advanced DevOps configuration files
  const fileContents: {[key: string]: string} = {
    'terraform/main.tf': `# Infrastructure as Code with Terraform
terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.23"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# VPC Configuration
resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name        = "\${var.project_name}-vpc"
    Environment = var.environment
  }
}

# EKS Cluster
resource "aws_eks_cluster" "main" {
  name     = "\${var.project_name}-cluster"
  role_arn = aws_iam_role.cluster.arn
  version  = var.kubernetes_version

  vpc_config {
    subnet_ids              = aws_subnet.private[*].id
    endpoint_private_access = true
    endpoint_public_access  = true
    public_access_cidrs     = var.allowed_cidrs
  }

  encryption_config {
    provider {
      key_arn = aws_kms_key.eks.arn
    }
    resources = ["secrets"]
  }

  depends_on = [
    aws_iam_role_policy_attachment.cluster_AmazonEKSClusterPolicy,
  ]

  tags = {
    Environment = var.environment
  }
}`,
    'ansible/playbook.yml': `---
- name: Deploy and Configure Application Infrastructure
  hosts: all
  become: yes
  vars:
    app_name: "myapp"
    app_version: "{{ lookup('env', 'APP_VERSION') | default('latest') }}"
    docker_registry: "{{ vault_docker_registry }}"
    
  pre_tasks:
    - name: Update system packages
      package:
        name: "*"
        state: latest
      when: ansible_os_family == "RedHat"

  roles:
    - docker
    - monitoring
    - security

  tasks:
    - name: Create application directory
      file:
        path: "/opt/{{ app_name }}"
        state: directory
        owner: "{{ app_user }}"
        group: "{{ app_group }}"
        mode: '0755'

    - name: Deploy application configuration
      template:
        src: "{{ item.src }}"
        dest: "/opt/{{ app_name }}/{{ item.dest }}"
        owner: "{{ app_user }}"
        group: "{{ app_group }}"
        mode: '0644'
      loop:
        - { src: "docker-compose.yml.j2", dest: "docker-compose.yml" }
        - { src: "nginx.conf.j2", dest: "nginx.conf" }
      notify: restart application

    - name: Start application services
      docker_compose:
        project_src: "/opt/{{ app_name }}"
        state: present
        pull: yes
      register: compose_result

    - name: Wait for application to be ready
      uri:
        url: "http://localhost:{{ app_port }}/health"
        method: GET
        status_code: 200
      retries: 30
      delay: 10

  handlers:
    - name: restart application
      docker_compose:
        project_src: "/opt/{{ app_name }}"
        restarted: yes`,
    'monitoring/prometheus.yml': `global:
  scrape_interval: 15s
  evaluation_interval: 15s
  external_labels:
    cluster: 'production'
    region: 'us-west-2'

rule_files:
  - "rules/*.yml"

alerting:
  alertmanagers:
    - static_configs:
        - targets:
          - alertmanager:9093

scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']

  - job_name: 'kubernetes-apiservers'
    kubernetes_sd_configs:
      - role: endpoints
    scheme: https
    tls_config:
      ca_file: /var/run/secrets/kubernetes.io/serviceaccount/ca.crt
    bearer_token_file: /var/run/secrets/kubernetes.io/serviceaccount/token
    relabel_configs:
      - source_labels: [__meta_kubernetes_namespace, __meta_kubernetes_service_name, __meta_kubernetes_endpoint_port_name]
        action: keep
        regex: default;kubernetes;https

  - job_name: 'kubernetes-nodes'
    kubernetes_sd_configs:
      - role: node
    scheme: https
    tls_config:
      ca_file: /var/run/secrets/kubernetes.io/serviceaccount/ca.crt
    bearer_token_file: /var/run/secrets/kubernetes.io/serviceaccount/token
    relabel_configs:
      - action: labelmap
        regex: __meta_kubernetes_node_label_(.+)

  - job_name: 'kubernetes-pods'
    kubernetes_sd_configs:
      - role: pod
    relabel_configs:
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]
        action: keep
        regex: true
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_path]
        action: replace
        target_label: __metrics_path__
        regex: (.+)`,
    'security/falco-rules.yaml': `# Falco Security Rules for Container Runtime Security
- rule: Write below binary dir
  desc: an attempt to write to any file below a set of binary directories
  condition: >
    bin_dir and evt.dir = < and open_write
    and not package_mgmt_procs
    and not exe_running_docker_save
    and not python_running_get_pip
    and not python_running_ms_oms
    and not user_known_write_below_binary_dir_activities
  output: >
    File below a known binary directory opened for writing (user=%user.name
    command=%proc.cmdline file=%fd.name parent=%proc.pname pcmdline=%proc.pcmdline gparent=%proc.aname[2])
  priority: ERROR
  tags: [filesystem, mitre_persistence]

- rule: Unexpected network outbound traffic
  desc: Detect unexpected network outbound traffic
  condition: >
    outbound and not fd.typechar = 4 and not fd.num in (0, 1, 2) and not fd.typechar = 6
    and not user_expected_outbound_connections_activities
  output: >
    Unexpected outbound connection (user=%user.name command=%proc.cmdline 
    connection=%fd.name proto=%fd.l4proto fd_type=%fd.type fd_proto=%fd.sockfamily)
  priority: NOTICE
  tags: [network, mitre_exfiltration]

- rule: Sensitive file opened for reading
  desc: an attempt to read any sensitive file (e.g. files containing user/password/authentication information)
  condition: >
    sensitive_files and open_read
    and proc_name_exists
    and not proc.name in (user_mgmt_binaries, userexec_binaries, package_mgmt_binaries,
     cron_binaries, read_sensitive_file_binaries, shell_binaries, hids_binaries,
     vpn_binaries, mail_config_binaries, nomachine_binaries, sshkit_script_binaries,
     in.proftpd, mandb, salt-minion, postgres_mgmt_binaries,
     google_osconfig_agent)
    and not cmp_cp_by_passwd
    and not ansible_running_python
    and not run_by_qualys
    and not run_by_chef
    and not run_by_google_accounts_daemon
    and not user_read_sensitive_file_conditions
  output: >
    Sensitive file opened for reading by non-trusted program (user=%user.name 
    program=%proc.name command=%proc.cmdline file=%fd.name parent=%proc.pname gparent=%proc.aname[2])
  priority: WARNING
  tags: [filesystem, mitre_credential_access]`
  };

  const handleFileClick = (fileName: string) => {
    setSelectedFile(fileName);
    if (fileContents[fileName]) {
      setCode(fileContents[fileName]);
    }
  };

  // Advanced terminal command simulation
  const simulateCommand = (command: string): string[] => {
    const cmd = command.trim().toLowerCase();
    
    switch (cmd) {
      case 'help':
        return [
          'Available Advanced DevOps commands:',
          '  terraform init       - Initialize Terraform working directory',
          '  terraform plan       - Create execution plan',
          '  terraform apply      - Apply Terraform configuration',
          '  ansible-playbook     - Run Ansible playbook',
          '  helm install         - Install Helm chart',
          '  kubectl apply -f     - Apply Kubernetes manifests',
          '  prometheus --version - Show Prometheus version',
          '  grafana-cli --version- Show Grafana CLI version',
          '  falco --version      - Show Falco version',
          '  vault status         - Show Vault status',
          '  consul members       - Show Consul cluster members',
          '  istioctl version     - Show Istio version',
          '  clear               - Clear terminal',
          '  ls                  - List files',
          '  pwd                 - Show current directory'
        ];
      
      case 'terraform init':
        return [
          'Initializing the backend...',
          '',
          'Initializing provider plugins...',
          '- Finding hashicorp/aws versions matching "~> 5.0"...',
          '- Finding hashicorp/kubernetes versions matching "~> 2.23"...',
          '- Installing hashicorp/aws v5.31.0...',
          '- Installed hashicorp/aws v5.31.0 (signed by HashiCorp)',
          '- Installing hashicorp/kubernetes v2.23.0...',
          '- Installed hashicorp/kubernetes v2.23.0 (signed by HashiCorp)',
          '',
          'Terraform has been successfully initialized!'
        ];
      
      case 'terraform plan':
        return [
          'Refreshing Terraform state in-memory prior to plan...',
          '',
          'An execution plan has been generated and is shown below.',
          'Resource actions are indicated with the following symbols:',
          '  + create',
          '  ~ modify',
          '  - destroy',
          '',
          'Terraform will perform the following actions:',
          '',
          '  # aws_eks_cluster.main will be created',
          '  + resource "aws_eks_cluster" "main" {',
          '      + arn                   = (known after apply)',
          '      + name                  = "myapp-cluster"',
          '      + platform_version      = (known after apply)',
          '      + role_arn             = (known after apply)',
          '      + status               = (known after apply)',
          '      + version              = "1.28"',
          '    }',
          '',
          'Plan: 15 to add, 0 to change, 0 to destroy.'
        ];
      
      case 'terraform apply':
        return [
          'aws_iam_role.cluster: Creating...',
          'aws_vpc.main: Creating...',
          'aws_kms_key.eks: Creating...',
          'aws_iam_role.cluster: Creation complete after 2s',
          'aws_vpc.main: Creation complete after 3s',
          'aws_kms_key.eks: Creation complete after 1s',
          'aws_eks_cluster.main: Creating...',
          'aws_eks_cluster.main: Still creating... [10s elapsed]',
          'aws_eks_cluster.main: Still creating... [20s elapsed]',
          'aws_eks_cluster.main: Creation complete after 25s',
          '',
          'Apply complete! Resources: 15 added, 0 changed, 0 destroyed.'
        ];
      
      case 'ansible-playbook playbook.yml':
        return [
          'PLAY [Deploy and Configure Application Infrastructure] ******************',
          '',
          'TASK [Gathering Facts] *************************************************',
          'ok: [web-server-1]',
          'ok: [web-server-2]',
          'ok: [web-server-3]',
          '',
          'TASK [Update system packages] ******************************************',
          'changed: [web-server-1]',
          'changed: [web-server-2]',
          'changed: [web-server-3]',
          '',
          'TASK [Deploy application configuration] ****************************',
          'changed: [web-server-1]',
          'changed: [web-server-2]',
          'changed: [web-server-3]',
          '',
          'PLAY RECAP *************************************************************',
          'web-server-1               : ok=8    changed=3    unreachable=0    failed=0',
          'web-server-2               : ok=8    changed=3    unreachable=0    failed=0',
          'web-server-3               : ok=8    changed=3    unreachable=0    failed=0'
        ];
      
      case 'helm install myapp ./chart':
        return [
          'NAME: myapp',
          'LAST DEPLOYED: Mon Jan 15 10:30:45 2024',
          'NAMESPACE: default',
          'STATUS: deployed',
          'REVISION: 1',
          'TEST SUITE: None',
          'NOTES:',
          '1. Get the application URL by running these commands:',
          '  export POD_NAME=$(kubectl get pods --namespace default -l "app.kubernetes.io/name=myapp" -o jsonpath="{.items[0].metadata.name}")',
          '  echo "Visit http://127.0.0.1:8080 to use your application"',
          '  kubectl --namespace default port-forward $POD_NAME 8080:80'
        ];
      
      case 'prometheus --version':
        return [
          'prometheus, version 2.45.0 (branch: HEAD, revision: 8ef767e396c8)',
          '  build user:       root@buildkitsandbox',
          '  build date:       20230623-13:25:27',
          '  go version:       go1.20.5',
          '  platform:         linux/amd64'
        ];
      
      case 'vault status':
        return [
          'Key             Value',
          '---             -----',
          'Seal Type       shamir',
          'Initialized     true',
          'Sealed          false',
          'Total Shares    5',
          'Threshold       3',
          'Version         1.15.2',
          'Build Date      2023-11-06T11:33:28Z',
          'Storage Type    consul',
          'Cluster Name    vault-cluster-a1b2c3d4',
          'Cluster ID      12345678-1234-1234-1234-123456789012',
          'HA Enabled      true',
          'HA Cluster      https://vault-1.example.com:8201',
          'HA Mode         active',
          'Active Since    2024-01-15T10:00:00.000000000Z'
        ];
      
      case 'istioctl version':
        return [
          'client version: 1.19.3',
          'control plane version: 1.19.3',
          'data plane version: 1.19.3 (2 proxies)'
        ];
      
      case 'falco --version':
        return [
          'Falco version: 0.36.2',
          'Driver version: 5.0.1+driver',
          'Rules version: 2.0.0'
        ];
      
      case 'ls':
        return [
          'terraform/',
          'ansible/',
          'monitoring/',
          'security/',
          'helm-charts/',
          'kubernetes/',
          'docker-compose.yml',
          'Makefile',
          'README.md'
        ];
      
      case 'pwd':
        return ['/home/devops/advanced-infrastructure'];
      
      case 'clear':
        return [];
      
      default:
        if (cmd.startsWith('kubectl apply')) {
          return [
            'deployment.apps/web-app configured',
            'service/web-app-service configured',
            'ingress.networking.k8s.io/web-app-ingress configured',
            'horizontalpodautoscaler.autoscaling/web-app-hpa configured'
          ];
        }
        
        if (cmd.startsWith('helm upgrade')) {
          return [
            'Release "myapp" has been upgraded. Happy Helming!',
            'NAME: myapp',
            'LAST DEPLOYED: Mon Jan 15 11:45:30 2024',
            'NAMESPACE: default',
            'STATUS: deployed',
            'REVISION: 2'
          ];
        }
        
        if (cmd.startsWith('vault write')) {
          return [
            'Success! Data written to: secret/myapp/config'
          ];
        }
        
        return [`Command not found: ${command}. Type 'help' for available commands.`];
    }
  };

  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!terminalInput.trim()) return;

    const newHistory = [...terminalHistory, `$ ${terminalInput}`];
    const output = simulateCommand(terminalInput);
    
    if (output.length === 0) {
      // Clear command
      setTerminalHistory(['Welcome to Advanced DevOps Terminal!', 'Type "help" to see available advanced commands.', '']);
    } else {
      setTerminalHistory([...newHistory, ...output, '']);
    }
    
    setCommandHistory(prev => [...prev, terminalInput]);
    setTerminalInput('');
    setHistoryIndex(-1);
  };

  const handleTerminalKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setTerminalInput(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setTerminalInput('');
        } else {
          setHistoryIndex(newIndex);
          setTerminalInput(commandHistory[newIndex]);
        }
      }
    }
  };

  // Scroll terminal to bottom when history updates
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalHistory]);

  // DevOps Advanced Course - Module-based
  const courseModules: CourseModule[] = [
    {
      id: 'infrastructure-as-code',
      title: 'Infrastructure as Code',
      lessons: [
        {
          id: 'terraform-advanced',
          title: 'Advanced Terraform Patterns',
          content: `
            <div style="margin-bottom: 20px; text-align: center;">
              <h3>📹 Video Explanation</h3>
              <div style="width: 100%; max-width: 800px; height: 400px; margin: 0 auto; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; font-weight: bold;">
                📹 Video Explanation Coming Soon
              </div>
              <p style="margin-top: 10px; color: #666; font-size: 14px;">Video explanation coming soon - stay tuned!</p>
            </div>
            
            <h2>🏗️ Advanced Terraform Patterns</h2>
            <p>Master advanced Infrastructure as Code patterns with Terraform for enterprise-scale deployments.</p>
            
            <h3>🎯 Advanced Concepts</h3>
            <ul>
              <li><strong>Modules:</strong> Reusable infrastructure components</li>
              <li><strong>Remote State:</strong> Centralized state management with locking</li>
              <li><strong>Workspaces:</strong> Environment isolation and management</li>
              <li><strong>Data Sources:</strong> Reference existing infrastructure</li>
              <li><strong>Dynamic Blocks:</strong> Generate repeated configuration blocks</li>
              <li><strong>Custom Providers:</strong> Extend Terraform functionality</li>
            </ul>
            
            <h3>🔧 Enterprise Patterns</h3>
            <ul>
              <li><strong>Multi-Environment Setup:</strong> Dev, staging, production isolation</li>
              <li><strong>State Management:</strong> Remote backends with encryption</li>
              <li><strong>Policy as Code:</strong> Sentinel and OPA integration</li>
              <li><strong>CI/CD Integration:</strong> Automated planning and deployment</li>
              <li><strong>Cost Management:</strong> Resource tagging and cost estimation</li>
            </ul>
            
            <h3>🛡️ Security Best Practices</h3>
            <ul>
              <li><strong>Secrets Management:</strong> Vault integration for sensitive data</li>
              <li><strong>Least Privilege:</strong> IAM roles and policies</li>
              <li><strong>Network Security:</strong> VPC, security groups, NACLs</li>
              <li><strong>Encryption:</strong> At-rest and in-transit encryption</li>
              <li><strong>Compliance:</strong> SOC2, HIPAA, PCI-DSS requirements</li>
            </ul>
            
            <h3>📊 Monitoring and Observability</h3>
            <ul>
              <li><strong>Resource Monitoring:</strong> CloudWatch, Prometheus integration</li>
              <li><strong>State Drift Detection:</strong> Automated compliance checking</li>
              <li><strong>Cost Tracking:</strong> Resource cost attribution</li>
              <li><strong>Change Management:</strong> Audit trails and approvals</li>
            </ul>
          `,
          codeExample: `# Advanced Terraform Configuration
terraform {
  required_version = ">= 1.0"
  
  backend "s3" {
    bucket         = "mycompany-terraform-state"
    key            = "infrastructure/terraform.tfstate"
    region         = "us-west-2"
    encrypt        = true
    dynamodb_table = "terraform-locks"
    
    assume_role {
      role_arn = "arn:aws:iam::123456789012:role/TerraformRole"
    }
  }
  
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    vault = {
      source  = "hashicorp/vault"
      version = "~> 3.0"
    }
  }
}

# Multi-environment configuration
locals {
  environment = terraform.workspace
  
  common_tags = {
    Environment   = local.environment
    Project      = var.project_name
    Owner        = var.team_name
    CostCenter   = var.cost_center
    ManagedBy    = "terraform"
    CreatedAt    = timestamp()
  }
  
  # Environment-specific configurations
  env_config = {
    dev = {
      instance_type = "t3.micro"
      min_size     = 1
      max_size     = 2
      db_instance  = "db.t3.micro"
    }
    staging = {
      instance_type = "t3.small"
      min_size     = 2
      max_size     = 4
      db_instance  = "db.t3.small"
    }
    production = {
      instance_type = "t3.medium"
      min_size     = 3
      max_size     = 10
      db_instance  = "db.r5.large"
    }
  }
}

# Data source for existing VPC
data "aws_vpc" "existing" {
  count = var.create_vpc ? 0 : 1
  
  filter {
    name   = "tag:Name"
    values = ["\${var.project_name}-vpc"]
  }
}

# Vault secrets
data "vault_generic_secret" "db_credentials" {
  path = "secret/\${local.environment}/database"
}

# Dynamic security group rules
resource "aws_security_group" "app" {
  name_prefix = "\${var.project_name}-app-"
  vpc_id      = local.vpc_id
  
  dynamic "ingress" {
    for_each = var.allowed_ports
    content {
      from_port   = ingress.value.port
      to_port     = ingress.value.port
      protocol    = ingress.value.protocol
      cidr_blocks = ingress.value.cidr_blocks
      description = ingress.value.description
    }
  }
  
  tags = merge(local.common_tags, {
    Name = "\${var.project_name}-app-sg"
  })
}

# Module usage with conditional creation
module "database" {
  source = "./modules/rds"
  count  = var.create_database ? 1 : 0
  
  identifier     = "\${var.project_name}-\${local.environment}"
  engine_version = var.db_engine_version
  instance_class = local.env_config[local.environment].db_instance
  
  username = data.vault_generic_secret.db_credentials.data["username"]
  password = data.vault_generic_secret.db_credentials.data["password"]
  
  vpc_security_group_ids = [aws_security_group.database.id]
  subnet_group_name      = aws_db_subnet_group.main.name
  
  backup_retention_period = local.environment == "production" ? 30 : 7
  backup_window          = "03:00-04:00"
  maintenance_window     = "sun:04:00-sun:05:00"
  
  performance_insights_enabled = local.environment == "production"
  monitoring_interval         = local.environment == "production" ? 60 : 0
  
  tags = local.common_tags
}

# Output with conditional logic
output "database_endpoint" {
  description = "RDS instance endpoint"
  value       = var.create_database ? module.database[0].endpoint : null
  sensitive   = true
}`,
          terminalCommands: [
            'terraform init',
            'terraform workspace list',
            'terraform plan -var-file="environments/production.tfvars"'
          ],
          exercises: [
            {
              id: 'ex1',
              question: 'Create a Terraform module for an EKS cluster with advanced security configurations',
              initialCode: '# Create an EKS cluster module with:\n# - KMS encryption for secrets\n# - Private endpoint access\n# - IRSA (IAM Roles for Service Accounts)\n# - Network policies\n# - Pod security standards',
              solution: 'module "eks" {\n  source = "./modules/eks"\n  \n  cluster_name    = var.cluster_name\n  cluster_version = var.kubernetes_version\n  \n  vpc_id     = module.vpc.vpc_id\n  subnet_ids = module.vpc.private_subnets\n  \n  # Security configurations\n  cluster_encryption_config = [\n    {\n      provider_key_arn = aws_kms_key.eks.arn\n      resources        = ["secrets"]\n    }\n  ]\n  \n  cluster_endpoint_private_access = true\n  cluster_endpoint_public_access  = false\n  \n  # IRSA\n  enable_irsa = true\n  \n  # Add-ons\n  cluster_addons = {\n    coredns = {\n      resolve_conflicts = "OVERWRITE"\n    }\n    kube-proxy = {}\n    vpc-cni = {\n      resolve_conflicts = "OVERWRITE"\n    }\n  }\n  \n  tags = local.common_tags\n}',
              hint: 'Use module structure with security configurations including KMS encryption, private endpoints, and IRSA',
              terminalTask: 'Try running: terraform init && terraform plan'
            }
          ]
        }
      ]
    },
    {
      id: 'advanced-orchestration',
      title: 'Advanced Container Orchestration',
      lessons: [
        {
          id: 'service-mesh',
          title: 'Service Mesh with Istio',
          content: `
            <div style="margin-bottom: 20px; text-align: center;">
              <h3>📹 Video Explanation</h3>
              <div style="width: 100%; max-width: 800px; height: 400px; margin: 0 auto; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); background: linear-gradient(135deg, #466bb0 0%, #5b7ec8 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; font-weight: bold;">
                📹 Video Explanation Coming Soon
              </div>
              <p style="margin-top: 10px; color: #666; font-size: 14px;">Video explanation coming soon - stay tuned!</p>
            </div>
            
            <h2>🕸️ Service Mesh Architecture</h2>
            <p>Implement advanced microservices communication patterns with Istio service mesh for traffic management, security, and observability.</p>
            
            <h3>🎯 Core Components</h3>
            <ul>
              <li><strong>Envoy Proxy:</strong> Sidecar proxy for service communication</li>
              <li><strong>Istiod:</strong> Control plane for configuration and certificate management</li>
              <li><strong>Pilot:</strong> Service discovery and traffic management</li>
              <li><strong>Citadel:</strong> Certificate authority and identity management</li>
              <li><strong>Galley:</strong> Configuration validation and distribution</li>
            </ul>
            
            <h3>🚦 Traffic Management</h3>
            <ul>
              <li><strong>Virtual Services:</strong> Define routing rules and traffic splitting</li>
              <li><strong>Destination Rules:</strong> Configure load balancing and circuit breakers</li>
              <li><strong>Gateways:</strong> Manage ingress and egress traffic</li>
              <li><strong>Service Entries:</strong> Add external services to the mesh</li>
              <li><strong>Sidecars:</strong> Optimize proxy configuration</li>
            </ul>
            
            <h3>🔒 Security Features</h3>
            <ul>
              <li><strong>mTLS:</strong> Automatic mutual TLS between services</li>
              <li><strong>Authorization Policies:</strong> Fine-grained access control</li>
              <li><strong>JWT Validation:</strong> Token-based authentication</li>
              <li><strong>Security Policies:</strong> Network and application-level security</li>
            </ul>
            
            <h3>📊 Observability</h3>
            <ul>
              <li><strong>Distributed Tracing:</strong> Jaeger integration for request tracing</li>
              <li><strong>Metrics Collection:</strong> Prometheus metrics for all services</li>
              <li><strong>Access Logs:</strong> Detailed request/response logging</li>
              <li><strong>Service Graph:</strong> Kiali for service topology visualization</li>
            </ul>
            
            <h3>🎛️ Advanced Patterns</h3>
            <ul>
              <li><strong>Canary Deployments:</strong> Gradual traffic shifting</li>
              <li><strong>Circuit Breaking:</strong> Fault tolerance and resilience</li>
              <li><strong>Rate Limiting:</strong> Traffic throttling and protection</li>
              <li><strong>Retry Policies:</strong> Automatic request retries</li>
              <li><strong>Timeout Configuration:</strong> Request timeout management</li>
            </ul>
          `,
          codeExample: `# Istio Service Mesh Configuration
apiVersion: networking.istio.io/v1beta1
kind: Gateway
metadata:
  name: bookinfo-gateway
  namespace: bookinfo
spec:
  selector:
    istio: ingressgateway
  servers:
  - port:
      number: 80
      name: http
      protocol: HTTP
    hosts:
    - bookinfo.example.com
  - port:
      number: 443
      name: https
      protocol: HTTPS
    tls:
      mode: SIMPLE
      credentialName: bookinfo-tls
    hosts:
    - bookinfo.example.com

---
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: bookinfo
  namespace: bookinfo
spec:
  hosts:
  - bookinfo.example.com
  gateways:
  - bookinfo-gateway
  http:
  - match:
    - headers:
        canary:
          exact: "true"
    route:
    - destination:
        host: productpage
        subset: v2
      weight: 100
  - match:
    - uri:
        prefix: /api/v1
    route:
    - destination:
        host: productpage
        subset: v1
      weight: 90
    - destination:
        host: productpage
        subset: v2
      weight: 10
    fault:
      delay:
        percentage:
          value: 0.1
        fixedDelay: 5s
    retries:
      attempts: 3
      perTryTimeout: 2s
      retryOn: gateway-error,connect-failure,refused-stream
    timeout: 10s

---
apiVersion: networking.istio.io/v1beta1
kind: DestinationRule
metadata:
  name: productpage
  namespace: bookinfo
spec:
  host: productpage
  trafficPolicy:
    connectionPool:
      tcp:
        maxConnections: 100
      http:
        http1MaxPendingRequests: 50
        http2MaxRequests: 100
        maxRequestsPerConnection: 2
        maxRetries: 3
        consecutiveGatewayErrors: 5
        interval: 30s
        baseEjectionTime: 30s
        maxEjectionPercent: 50
    loadBalancer:
      simple: LEAST_CONN
    outlierDetection:
      consecutiveGatewayErrors: 5
      interval: 30s
      baseEjectionTime: 30s
      maxEjectionPercent: 50
      minHealthPercent: 50
  subsets:
  - name: v1
    labels:
      version: v1
    trafficPolicy:
      connectionPool:
        tcp:
          maxConnections: 50
  - name: v2
    labels:
      version: v2
    trafficPolicy:
      connectionPool:
        tcp:
          maxConnections: 25

---
apiVersion: security.istio.io/v1beta1
kind: AuthorizationPolicy
metadata:
  name: productpage-policy
  namespace: bookinfo
spec:
  selector:
    matchLabels:
      app: productpage
  rules:
  - from:
    - source:
        principals: ["cluster.local/ns/bookinfo/sa/bookinfo-gateway"]
    - source:
        namespaces: ["bookinfo"]
    to:
    - operation:
        methods: ["GET", "POST"]
        paths: ["/api/*"]
    when:
    - key: request.headers[user-agent]
      values: ["Mozilla/*", "Chrome/*"]
  - from:
    - source:
        principals: ["cluster.local/ns/monitoring/sa/prometheus"]
    to:
    - operation:
        methods: ["GET"]
        paths: ["/metrics", "/health"]

---
apiVersion: security.istio.io/v1beta1
kind: PeerAuthentication
metadata:
  name: default
  namespace: bookinfo
spec:
  mtls:
    mode: STRICT`,
          terminalCommands: [
            'istioctl version',
            'istioctl proxy-status',
            'kubectl get vs,dr,gw -n bookinfo'
          ],
          exercises: [
            {
              id: 'ex2',
              question: 'Configure a canary deployment with Istio for gradual traffic shifting',
              initialCode: '# Create Istio configuration for canary deployment:\n# - 90% traffic to v1, 10% to v2 initially\n# - Gradual shift to 50/50, then 100% v2\n# - Include circuit breaker and retry policies\n# - Add authorization for specific user groups',
              solution: 'apiVersion: networking.istio.io/v1beta1\nkind: VirtualService\nmetadata:\n  name: canary-deployment\nspec:\n  hosts:\n  - myapp\n  http:\n  - match:\n    - headers:\n        user-group:\n          exact: "beta-testers"\n    route:\n    - destination:\n        host: myapp\n        subset: v2\n      weight: 100\n  - route:\n    - destination:\n        host: myapp\n        subset: v1\n      weight: 90\n    - destination:\n        host: myapp\n        subset: v2\n      weight: 10\n    retries:\n      attempts: 3\n      perTryTimeout: 2s\n    timeout: 10s\n---\napiVersion: networking.istio.io/v1beta1\nkind: DestinationRule\nmetadata:\n  name: myapp\nspec:\n  host: myapp\n  trafficPolicy:\n    outlierDetection:\n      consecutiveGatewayErrors: 3\n      interval: 30s\n      baseEjectionTime: 30s\n  subsets:\n  - name: v1\n    labels:\n      version: v1\n  - name: v2\n    labels:\n      version: v2',
              hint: 'Use VirtualService for traffic splitting and DestinationRule for circuit breaking. Include header-based routing for beta testers',
              terminalTask: 'Try running: istioctl analyze -n default'
            }
          ]
        }
      ]
    },
    {
      id: 'security-compliance',
      title: 'Security and Compliance',
      lessons: [
        {
          id: 'runtime-security',
          title: 'Container Runtime Security',
          content: `
            <div style="margin-bottom: 20px; text-align: center;">
              <h3>📹 Video Explanation</h3>
              <div style="width: 100%; max-width: 800px; height: 400px; margin: 0 auto; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; font-weight: bold;">
                📹 Video Explanation Coming Soon
              </div>
              <p style="margin-top: 10px; color: #666; font-size: 14px;">Video explanation coming soon - stay tuned!</p>
            </div>
            
            <h2>🛡️ Container Runtime Security</h2>
            <p>Implement comprehensive security monitoring and threat detection for containerized environments using advanced security tools.</p>
            
            <h3>🎯 Security Layers</h3>
            <ul>
              <li><strong>Image Security:</strong> Vulnerability scanning and image signing</li>
              <li><strong>Runtime Protection:</strong> Behavioral analysis and anomaly detection</li>
              <li><strong>Network Security:</strong> Micro-segmentation and traffic inspection</li>
              <li><strong>Data Protection:</strong> Encryption and secrets management</li>
              <li><strong>Compliance:</strong> Policy enforcement and audit trails</li>
            </ul>
            
            <h3>🔍 Threat Detection</h3>
            <ul>
              <li><strong>Falco:</strong> Runtime security monitoring and alerting</li>
              <li><strong>Sysdig:</strong> Container visibility and forensics</li>
              <li><strong>Twistlock/Prisma:</strong> Comprehensive container security platform</li>
              <li><strong>Aqua Security:</strong> Full lifecycle container security</li>
              <li><strong>StackRox:</strong> Kubernetes-native security platform</li>
            </ul>
            
            <h3>📋 Security Policies</h3>
            <ul>
              <li><strong>Pod Security Standards:</strong> Kubernetes security policies</li>
              <li><strong>Network Policies:</strong> Traffic segmentation and isolation</li>
              <li><strong>RBAC:</strong> Role-based access control</li>
              <li><strong>Admission Controllers:</strong> Policy enforcement at deployment</li>
              <li><strong>OPA Gatekeeper:</strong> Policy as code with Open Policy Agent</li>
            </ul>
            
            <h3>🔐 Secrets Management</h3>
            <ul>
              <li><strong>HashiCorp Vault:</strong> Centralized secrets management</li>
              <li><strong>AWS Secrets Manager:</strong> Cloud-native secrets storage</li>
              <li><strong>Azure Key Vault:</strong> Microsoft cloud key management</li>
              <li><strong>External Secrets Operator:</strong> Kubernetes secrets integration</li>
            </ul>
            
            <h3>📊 Compliance Frameworks</h3>
            <ul>
              <li><strong>CIS Benchmarks:</strong> Security configuration standards</li>
              <li><strong>NIST Framework:</strong> Cybersecurity framework compliance</li>
              <li><strong>SOC 2:</strong> Service organization control compliance</li>
              <li><strong>PCI DSS:</strong> Payment card industry standards</li>
              <li><strong>HIPAA:</strong> Healthcare information protection</li>
            </ul>
          `,
          codeExample: `# Comprehensive Security Configuration
# Pod Security Policy (deprecated, use Pod Security Standards)
apiVersion: policy/v1beta1
kind: PodSecurityPolicy
metadata:
  name: restricted-psp
spec:
  privileged: false
  allowPrivilegeEscalation: false
  requiredDropCapabilities:
    - ALL
  volumes:
    - 'configMap'
    - 'emptyDir'
    - 'projected'
    - 'secret'
    - 'downwardAPI'
    - 'persistentVolumeClaim'
  runAsUser:
    rule: 'MustRunAsNonRoot'
  seLinux:
    rule: 'RunAsAny'
  fsGroup:
    rule: 'RunAsAny'
  readOnlyRootFilesystem: true
  seccompProfile:
    type: RuntimeDefault

---
# Network Policy for micro-segmentation
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: web-app-netpol
  namespace: production
spec:
  podSelector:
    matchLabels:
      app: web-app
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          name: ingress-nginx
    - podSelector:
        matchLabels:
          app: load-balancer
    ports:
    - protocol: TCP
      port: 8080
  egress:
  - to:
    - podSelector:
        matchLabels:
          app: database
    ports:
    - protocol: TCP
      port: 5432
  - to:
    - namespaceSelector:
        matchLabels:
          name: monitoring
    ports:
    - protocol: TCP
      port: 9090

---
# OPA Gatekeeper Constraint Template
apiVersion: templates.gatekeeper.sh/v1beta1
kind: ConstraintTemplate
metadata:
  name: k8srequiredsecuritycontext
spec:
  crd:
    spec:
      names:
        kind: K8sRequiredSecurityContext
      validation:
        openAPIV3Schema:
          type: object
          properties:
            runAsNonRoot:
              type: boolean
            readOnlyRootFilesystem:
              type: boolean
            allowPrivilegeEscalation:
              type: boolean
  targets:
    - target: admission.k8s.gatekeeper.sh
      rego: |
        package k8srequiredsecuritycontext
        
        violation[{"msg": msg}] {
          container := input.review.object.spec.containers[_]
          not container.securityContext.runAsNonRoot
          msg := "Container must run as non-root user"
        }
        
        violation[{"msg": msg}] {
          container := input.review.object.spec.containers[_]
          not container.securityContext.readOnlyRootFilesystem
          msg := "Container must have read-only root filesystem"
        }
        
        violation[{"msg": msg}] {
          container := input.review.object.spec.containers[_]
          container.securityContext.allowPrivilegeEscalation != false
          msg := "Container must not allow privilege escalation"
        }

---
# Falco Rule for Runtime Security
apiVersion: v1
kind: ConfigMap
metadata:
  name: falco-rules
  namespace: falco-system
data:
  custom_rules.yaml: |
    - rule: Detect crypto mining
      desc: Detect cryptocurrency mining activities
      condition: >
        spawned_process and proc.name in (xmrig, minergate, cpuminer, cgminer)
      output: >
        Crypto mining process detected (user=%user.name command=%proc.cmdline 
        container=%container.name image=%container.image.repository)
      priority: CRITICAL
      tags: [cryptocurrency, mining, malware]
    
    - rule: Suspicious network activity
      desc: Detect suspicious outbound network connections
      condition: >
        outbound and fd.typechar = 4 and fd.num >= 0 and 
        not fd.name in (allowed_destinations) and
        not proc.name in (allowed_processes)
      output: >
        Suspicious outbound connection (user=%user.name command=%proc.cmdline 
        connection=%fd.name proto=%fd.l4proto)
      priority: WARNING
      tags: [network, suspicious]
    
    - rule: Container drift detection
      desc: Detect when files are created in containers
      condition: >
        container and not container.image.repository in (allowed_images) and
        (open_write or rename or mkdir or rmdir) and
        not fd.name startswith /tmp and
        not fd.name startswith /var/log
      output: >
        File created in container (user=%user.name command=%proc.cmdline 
        file=%fd.name container=%container.name)
      priority: WARNING
      tags: [container, drift, filesystem]

---
# External Secrets Operator Configuration
apiVersion: external-secrets.io/v1beta1
kind: SecretStore
metadata:
  name: vault-backend
  namespace: production
spec:
  provider:
    vault:
      server: "https://vault.company.com"
      path: "secret"
      version: "v2"
      auth:
        kubernetes:
          mountPath: "kubernetes"
          role: "external-secrets"
          serviceAccountRef:
            name: external-secrets-sa

---
apiVersion: external-secrets.io/v1beta1
kind: ExternalSecret
metadata:
  name: app-secrets
  namespace: production
spec:
  refreshInterval: 1h
  secretStoreRef:
    name: vault-backend
    kind: SecretStore
  target:
    name: app-secrets
    creationPolicy: Owner
  data:
  - secretKey: database-password
    remoteRef:
      key: myapp/database
      property: password
  - secretKey: api-key
    remoteRef:
      key: myapp/external-api
      property: key`,
          terminalCommands: [
            'falco --version',
            'kubectl get psp',
            'kubectl get networkpolicies -A'
          ],
          exercises: [
            {
              id: 'ex3',
              question: 'Create a comprehensive security policy for a production Kubernetes cluster',
              initialCode: '# Create security configurations including:\n# - Pod Security Standards\n# - Network policies for database tier\n# - OPA Gatekeeper constraint for required labels\n# - Falco rule for detecting privilege escalation\n# - External secret for database credentials',
              solution: 'apiVersion: v1\nkind: Namespace\nmetadata:\n  name: production\n  labels:\n    pod-security.kubernetes.io/enforce: restricted\n    pod-security.kubernetes.io/audit: restricted\n    pod-security.kubernetes.io/warn: restricted\n---\napiVersion: networking.k8s.io/v1\nkind: NetworkPolicy\nmetadata:\n  name: database-netpol\n  namespace: production\nspec:\n  podSelector:\n    matchLabels:\n      tier: database\n  policyTypes:\n  - Ingress\n  ingress:\n  - from:\n    - podSelector:\n        matchLabels:\n          tier: application\n    ports:\n    - protocol: TCP\n      port: 5432\n---\napiVersion: kustomize.config.k8s.io/v1beta1\nkind: Kustomization\nresources:\n- namespace.yaml\n- networkpolicy.yaml\npatches:\n- patch: |\n    - op: add\n      path: /metadata/labels/security.company.com~1scanned\n      value: "true"\n  target:\n    kind: Deployment',
              hint: 'Use Pod Security Standards at namespace level, create network policies for database isolation, and include required security labels',
              terminalTask: 'Try running: kubectl apply -f security-policies.yaml'
            }
          ]
        }
      ]
    }
  ];

  useEffect(() => {
    if (moduleId && lessonId) {
      const module = courseModules.find(m => m.id === moduleId);
      if (module) {
        setCurrentModule(module);
        const lesson = module.lessons.find(l => l.id === lessonId);
        if (lesson) {
          setCurrentLesson(lesson);
          setCode(lesson.codeExample);
          if (lesson.exercises.length > 0) {
            setCurrentExerciseId(lesson.exercises[0].id);
          }
        }
      }
    } else {
      // Default to first module and lesson
      setCurrentModule(courseModules[0]);
      setCurrentLesson(courseModules[0].lessons[0]);
      setCode(courseModules[0].lessons[0].codeExample);
      if (courseModules[0].lessons[0].exercises.length > 0) {
        setCurrentExerciseId(courseModules[0].lessons[0].exercises[0].id);
      }
    }
  }, [moduleId, lessonId]);

  const handleSubmitExercise = async () => {
    if (!currentExerciseId || !currentLesson) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setSubmittedExercises(prev => new Set([...prev, currentExerciseId]));
    setExerciseProgress(prev => ({
      ...prev,
      [currentExerciseId]: 100
    }));
    
    setSubmissionMessage('Great job! Your solution has been submitted successfully.');
    setShowSubmissionModal(true);
    setIsSubmitting(false);
  };

  const navigateToLesson = (moduleId: string, lessonId: string) => {
    navigate(`/course/devops-advanced/${moduleId}/${lessonId}`);
  };

  const getCurrentLessonIndex = () => {
    if (!currentModule || !currentLesson) return { moduleIndex: 0, lessonIndex: 0 };
    const moduleIndex = courseModules.findIndex(m => m.id === currentModule.id);
    const lessonIndex = currentModule.lessons.findIndex(l => l.id === currentLesson.id);
    return { moduleIndex, lessonIndex };
  };

  const getNextLesson = () => {
    const { moduleIndex, lessonIndex } = getCurrentLessonIndex();
    
    if (lessonIndex < currentModule!.lessons.length - 1) {
      return {
        moduleId: currentModule!.id,
        lessonId: currentModule!.lessons[lessonIndex + 1].id
      };
    } else if (moduleIndex < courseModules.length - 1) {
      return {
        moduleId: courseModules[moduleIndex + 1].id,
        lessonId: courseModules[moduleIndex + 1].lessons[0].id
      };
    }
    return null;
  };

  const getPreviousLesson = () => {
    const { moduleIndex, lessonIndex } = getCurrentLessonIndex();
    
    if (lessonIndex > 0) {
      return {
        moduleId: currentModule!.id,
        lessonId: currentModule!.lessons[lessonIndex - 1].id
      };
    } else if (moduleIndex > 0) {
      const prevModule = courseModules[moduleIndex - 1];
      return {
        moduleId: prevModule.id,
        lessonId: prevModule.lessons[prevModule.lessons.length - 1].id
      };
    }
    return null;
  };

  const nextLesson = getNextLesson();
  const prevLesson = getPreviousLesson();

  const currentExercise = currentLesson?.exercises.find(ex => ex.id === currentExerciseId);

  if (!currentModule || !currentLesson) {
    return <div>Loading...</div>;
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <Header />
      
      <div className="flex pt-16">
        {/* Sidebar */}
        <div className={`${sidebarOpen ? 'w-80' : 'w-16'} transition-all duration-300 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r h-screen sticky top-16 overflow-y-auto`}>
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className={`font-bold text-lg ${!sidebarOpen && 'hidden'}`}>DevOps Advanced</h2>
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              >
                <ArrowLeft className={`w-5 h-5 transition-transform ${!sidebarOpen && 'rotate-180'}`} />
              </button>
            </div>
            
            {sidebarOpen && (
              <div className="space-y-4">
                {courseModules.map((module, moduleIdx) => (
                  <div key={module.id} className="space-y-2">
                    <h3 className="font-semibold text-sm text-blue-600 dark:text-blue-400">
                      Module {moduleIdx + 1}: {module.title}
                    </h3>
                    <div className="space-y-1 ml-4">
                      {module.lessons.map((lesson, lessonIdx) => (
                        <button
                          key={lesson.id}
                          onClick={() => navigateToLesson(module.id, lesson.id)}
                          className={`w-full text-left p-2 rounded text-sm transition-colors ${
                            currentLesson.id === lesson.id
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                              : theme === 'dark' 
                                ? 'hover:bg-gray-700 text-gray-300' 
                                : 'hover:bg-gray-100 text-gray-600'
                          }`}
                        >
                          {lessonIdx + 1}. {lesson.title}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex">
          {/* Content Area */}
          <div className="flex-1 p-6">
            <div className="max-w-4xl mx-auto">
              {/* Header */}
              <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2">{currentLesson.title}</h1>
                <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                  <span className="flex items-center">
                    <Book className="w-4 h-4 mr-1" />
                    {currentModule.title}
                  </span>
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    45 min
                  </span>
                  <span className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    Advanced
                  </span>
                </div>
              </div>

              {/* Tab Navigation */}
              <div className="flex space-x-1 mb-6">
                {['theory', 'exercise', 'terminal'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      activeTab === tab
                        ? 'bg-blue-600 text-white'
                        : theme === 'dark'
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {tab === 'theory' && <Book className="w-4 h-4 inline mr-2" />}
                    {tab === 'exercise' && <Code className="w-4 h-4 inline mr-2" />}
                    {tab === 'terminal' && <Terminal className="w-4 h-4 inline mr-2" />}
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              {/* Theory Tab */}
              {activeTab === 'theory' && (
                <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 shadow-lg`}>
                  <div 
                    className="prose max-w-none dark:prose-invert"
                    dangerouslySetInnerHTML={{ __html: currentLesson.content }}
                  />
                  
                  <div className="mt-8">
                    <h3 className="text-xl font-semibold mb-4">📝 Code Example</h3>
                    <div className={`${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'} rounded-lg p-4 overflow-x-auto`}>
                      <pre className="text-sm">
                        <code>{currentLesson.codeExample}</code>
                      </pre>
                    </div>
                  </div>

                  {currentLesson.terminalCommands && (
                    <div className="mt-6">
                      <h3 className="text-xl font-semibold mb-4">💻 Try These Commands</h3>
                      <div className="space-y-2">
                        {currentLesson.terminalCommands.map((cmd, idx) => (
                          <div key={idx} className={`${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'} rounded p-3 font-mono text-sm`}>
                            <span className="text-green-500">$ </span>{cmd}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Exercise Tab */}
              {activeTab === 'exercise' && currentExercise && (
                <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 shadow-lg`}>
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-4">🎯 Exercise</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">{currentExercise.question}</p>
                    
                    {currentExercise.terminalTask && (
                      <div className={`${theme === 'dark' ? 'bg-blue-900' : 'bg-blue-50'} border border-blue-200 dark:border-blue-700 rounded-lg p-4 mb-4`}>
                        <div className="flex items-center mb-2">
                          <Terminal className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
                          <span className="font-medium text-blue-800 dark:text-blue-200">Terminal Task</span>
                        </div>
                        <p className="text-blue-700 dark:text-blue-300">{currentExercise.terminalTask}</p>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">Your Solution:</h4>
                      <textarea
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className={`w-full h-64 p-4 font-mono text-sm border rounded-lg ${
                          theme === 'dark' 
                            ? 'bg-gray-900 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                        placeholder="Write your solution here..."
                      />
                      
                      <div className="flex items-center justify-between mt-4">
                        <button
                          onClick={() => setCode(currentExercise.solution)}
                          className="flex items-center px-4 py-2 text-sm bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                        >
                          <Lightbulb className="w-4 h-4 mr-2" />
                          Show Solution
                        </button>
                        
                        <button
                          onClick={handleSubmitExercise}
                          disabled={isSubmitting || submittedExercises.has(currentExerciseId || '')}
                          className={`flex items-center px-6 py-2 rounded-lg font-medium transition-colors ${
                            submittedExercises.has(currentExerciseId || '')
                              ? 'bg-green-600 text-white cursor-not-allowed'
                              : isSubmitting
                                ? 'bg-blue-400 text-white cursor-not-allowed'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                          }`}
                        >
                          {isSubmitting ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Submitting...
                            </>
                          ) : (currentExerciseId ? submittedExercises.has(currentExerciseId) : false) ? (
                            <>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Completed
                            </>
                          ) : (
                            <>
                              <Send className="w-4 h-4 mr-2" />
                              Submit Solution
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Hint:</h4>
                      <div className={`${theme === 'dark' ? 'bg-yellow-900 border-yellow-700' : 'bg-yellow-50 border-yellow-200'} border rounded-lg p-4`}>
                        <p className="text-yellow-800 dark:text-yellow-200">{currentExercise.hint}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Terminal Tab */}
              {activeTab === 'terminal' && (
                <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 shadow-lg`}>
                  <div className="mb-4">
                    <h3 className="text-xl font-semibold mb-2 flex items-center">
                      <Terminal className="w-6 h-6 mr-2" />
                      Advanced DevOps Terminal
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Practice advanced DevOps commands in this simulated environment. Try infrastructure automation, monitoring, and security tools.
                    </p>
                  </div>

                  <div className="bg-black rounded-lg p-4 font-mono text-sm">
                    <div 
                      ref={terminalRef}
                      className="h-96 overflow-y-auto text-green-400 whitespace-pre-wrap"
                    >
                      {terminalHistory.map((line, idx) => (
                        <div key={idx}>{line}</div>
                      ))}
                    </div>
                    
                    <form onSubmit={handleTerminalSubmit} className="flex items-center mt-2">
                      <span className="text-green-400 mr-2">$</span>
                      <input
                        type="text"
                        value={terminalInput}
                        onChange={(e) => setTerminalInput(e.target.value)}
                        onKeyDown={handleTerminalKeyDown}
                        className="flex-1 bg-transparent text-green-400 outline-none"
                        placeholder="Enter advanced DevOps commands..."
                        autoFocus
                      />
                    </form>
                  </div>

                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
                    {[
                      'terraform init',
                      'ansible-playbook playbook.yml',
                      'helm install myapp ./chart',
                      'kubectl apply -f manifest.yaml',
                      'prometheus --version',
                      'vault status',
                      'istioctl version',
                      'falco --version'
                    ].map((cmd) => (
                      <button
                        key={cmd}
                        onClick={() => setTerminalInput(cmd)}
                        className={`p-2 text-xs rounded ${
                          theme === 'dark' 
                            ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                            : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                        } transition-colors`}
                      >
                        {cmd}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between items-center mt-8">
                <button
                  onClick={() => prevLesson && navigateToLesson(prevLesson.moduleId, prevLesson.lessonId)}
                  disabled={!prevLesson}
                  className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
                    !prevLesson
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
                      : 'bg-gray-600 text-white hover:bg-gray-700 dark:bg-gray-600 dark:hover:bg-gray-500'
                  }`}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous Lesson
                </button>

                <button
                  onClick={() => nextLesson && navigateToLesson(nextLesson.moduleId, nextLesson.lessonId)}
                  disabled={!nextLesson}
                  className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
                    !nextLesson
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
                      : 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500'
                  }`}
                >
                  Next Lesson
                  <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Submission Modal */}
      {showSubmissionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 max-w-md w-full mx-4`}>
            <div className="text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Exercise Completed!</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">{submissionMessage}</p>
              <button
                onClick={() => setShowSubmissionModal(false)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Continue Learning
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseLearningDevOpsAdvanced;
