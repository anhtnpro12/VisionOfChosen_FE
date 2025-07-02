# Terraform Drift Analyzer

AI-powered Terraform infrastructure drift detection and analysis platform with real-time AWS integration.

## 🚀 Features

### 🔍 **Drift Detection**
- **Real-time Analysis**: Continuous monitoring of Terraform infrastructure
- **AI-Powered Insights**: Intelligent drift analysis with risk assessment
- **Multi-format Support**: `.tfplan`, `.tfstate`, `.json`, `.tf` files
- **Risk Classification**: Automatic categorization (Low, Medium, High)

### 🤖 **AI Assistant**
- **Interactive Chat**: Natural language queries about infrastructure
- **File Upload**: Drag & drop Terraform files for instant analysis
- **AWS Integration**: Direct connection to AWS services
- **Smart Recommendations**: AI-generated solutions and best practices

### 📊 **Analytics & Reporting**
- **Infrastructure Metrics**: Real-time resource monitoring
- **Cost Analysis**: AWS cost tracking and optimization suggestions
- **Compliance Monitoring**: Security and compliance status
- **Historical Trends**: Drift detection over time

### 🔧 **Management Tools**
- **Scan History**: Complete audit trail of all scans
- **Chat History**: Persistent conversation logs with search
- **Settings Management**: AWS credentials and notification preferences
- **Email Alerts**: Configurable notifications for critical events

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **UI Components**: shadcn/ui, Tailwind CSS, Radix UI
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React
- **State Management**: React Hooks, Local Storage
- **Styling**: CSS Variables, Dark/Light themes

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- AWS Account (for infrastructure analysis)

### Quick Start

\`\`\`bash
# Clone the repository
git clone https://github.com/your-org/terraform-drift-analyzer.git
cd terraform-drift-analyzer

# Install dependencies
npm install

# Start development server
npm run dev
\`\`\`

### Using shadcn CLI (Recommended)

\`\`\`bash
# Install with shadcn CLI
npx shadcn@latest init

# Add required components
npx shadcn@latest add button card input textarea tabs sidebar
\`\`\`

## 🔧 Configuration

### Environment Variables

Create a \`.env.local\` file:

\`\`\`env
# AWS Configuration
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_DEFAULT_REGION=us-east-1

# Email Notifications
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
\`\`\`

### AWS IAM Permissions

Required IAM permissions for Terraform analysis:

\`\`\`json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ec2:Describe*",
        "s3:GetBucket*",
        "s3:ListBucket*",
        "rds:Describe*",
        "iam:Get*",
        "iam:List*",
        "cloudformation:Describe*",
        "cloudformation:List*"
      ],
      "Resource": "*"
    }
  ]
}
\`\`\`

## 🚦 Usage

### 1. Authentication
- Navigate to \`/auth/login\`
- Create account or sign in
- Access dashboard at \`/dashboard\`

### 2. AWS Connection
- Go to **Settings** → **AWS Connection**
- Configure AWS credentials
- Test connection
- Save settings

### 3. Infrastructure Analysis
- **Upload Files**: Drag & drop Terraform files
- **Chat with AI**: Ask questions about infrastructure
- **View Reports**: Check scan history and results
- **Monitor Metrics**: Track costs and compliance

### 4. Notifications
- **Settings** → **Email Notifications**
- Add recipient emails
- Configure alert types
- Enable/disable notifications

## 📁 Project Structure

\`\`\`
terraform-drift-analyzer/
├── app/                          # Next.js App Router
│   ├── auth/                     # Authentication pages
│   │   ├── login/
│   │   └── register/
│   ├── dashboard/                # Main application
│   │   ├── reports/              # Scan reports & history
│   │   ├── scan/[id]/           # Scan detail pages
│   │   ├── settings/            # Configuration
│   │   └── page.tsx             # Dashboard home
│   ├── globals.css              # Global styles
│   └── layout.tsx               # Root layout
├── components/                   # Reusable components
│   ├── ui/                      # shadcn/ui components
│   ├── ai-chat-interface.tsx    # AI chat component
│   ├── app-sidebar.tsx          # Navigation sidebar
│   ├── drift-card.tsx           # Drift display
│   ├── scan-history-table.tsx   # History table
│   └── upload-dialog.tsx        # File upload
├── hooks/                       # Custom React hooks
├── lib/                         # Utility functions
└── public/                      # Static assets
\`\`\`

## 🎨 UI Components

### Core Components
- **Sidebar Navigation**: Collapsible sidebar with menu items
- **AI Chat Interface**: Interactive chat with file upload
- **Drift Cards**: Expandable drift analysis cards
- **Scan History**: Sortable table with filters
- **Settings Forms**: AWS and notification configuration

### Design System
- **Colors**: Green theme with light/dark mode support
- **Typography**: Inter font family
- **Spacing**: Consistent 4px grid system
- **Components**: shadcn/ui component library

## 🔌 API Integration

### AWS Services
- **EC2**: Instance monitoring and analysis
- **S3**: Bucket configuration and security
- **RDS**: Database settings and backups
- **IAM**: Role and policy analysis
- **CloudFormation**: Stack drift detection

### Terraform Integration
- **State Files**: Parse and analyze \`.tfstate\`
- **Plan Files**: Review \`.tfplan\` changes
- **Configuration**: Analyze \`.tf\` files
- **Modules**: Support for Terraform modules

## 📈 Monitoring & Analytics

### Metrics Tracked
- **Resource Count**: Total infrastructure resources
- **Drift Detection**: Number of drifts over time
- **Cost Analysis**: Monthly AWS spending
- **Compliance Score**: Security and best practices
- **Scan Success Rate**: Analysis completion rate

### Reporting Features
- **Real-time Dashboards**: Live infrastructure status
- **Historical Trends**: Time-series drift analysis
- **Export Options**: PDF, JSON, CSV reports
- **Email Summaries**: Weekly/monthly reports

## 🔒 Security

### Data Protection
- **Encrypted Storage**: AWS credentials encrypted at rest
- **Secure Transmission**: HTTPS for all communications
- **Access Control**: Role-based permissions
- **Audit Logging**: Complete activity tracking

### Best Practices
- **IAM Roles**: Use IAM roles instead of access keys
- **Least Privilege**: Minimal required permissions
- **Regular Rotation**: Rotate credentials regularly
- **Environment Variables**: Never commit secrets to code

## 🚀 Deployment

### Vercel (Recommended)

\`\`\`bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel

# Set environment variables
vercel env add AWS_ACCESS_KEY_ID
vercel env add AWS_SECRET_ACCESS_KEY
\`\`\`

### Docker

\`\`\`dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
\`\`\`

### Manual Deployment

\`\`\`bash
# Build for production
npm run build

# Start production server
npm start
\`\`\`

## 🧪 Testing

\`\`\`bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
\`\`\`

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch (\`git checkout -b feature/amazing-feature\`)
3. **Commit** your changes (\`git commit -m 'Add amazing feature'\`)
4. **Push** to the branch (\`git push origin feature/amazing-feature\`)
5. **Open** a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use shadcn/ui components when possible
- Write tests for new features
- Update documentation
- Follow conventional commit messages

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Documentation
- **API Reference**: \`/docs/api\`
- **Component Library**: \`/docs/components\`
- **Deployment Guide**: \`/docs/deployment\`

### Community
- **GitHub Issues**: Bug reports and feature requests
- **Discussions**: Community Q&A and ideas
- **Discord**: Real-time chat support

### Enterprise Support
For enterprise support and custom implementations:
- 📧 Email: enterprise@terraform-analyzer.com
- 🌐 Website: https://terraform-analyzer.com
- 📞 Phone: +1 (555) 123-4567

## 🗺️ Roadmap

### Q1 2024
- [ ] Multi-cloud support (Azure, GCP)
- [ ] Advanced AI recommendations
- [ ] Custom rule engine
- [ ] API endpoints

### Q2 2024
- [ ] Terraform Cloud integration
- [ ] GitOps workflows
- [ ] Advanced analytics
- [ ] Mobile app

### Q3 2024
- [ ] Enterprise SSO
- [ ] Advanced RBAC
- [ ] Compliance frameworks
- [ ] Custom dashboards

## 📊 Changelog

### v1.0.0 (Current)
- ✅ Initial release
- ✅ AI-powered drift detection
- ✅ AWS integration
- ✅ Chat interface
- ✅ Scan history
- ✅ Settings management

### v0.9.0
- ✅ Beta release
- ✅ Core functionality
- ✅ UI components
- ✅ Basic reporting

---

**Made with ❤️ by the Terraform Drift Analyzer Team**

*Empowering DevOps teams with AI-driven infrastructure insights*
