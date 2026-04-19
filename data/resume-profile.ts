export type ResumeExperience = {
  title: string
  organization: string
  location: string
  start: string
  end: string
  highlights: string[]
}

export type ResumeProject = {
  title: string
  techStack: string[]
  repository?: string
  highlights: string[]
}

export type ResumeEducation = {
  credential: string
  institution: string
  location: string
  start: string
  end: string
  details?: string[]
}

export type ResumeSkillGroup = {
  category: string
  items: string[]
}

export type ResumeCourse = {
  title: string
  provider?: string
  topics: string[]
  notes?: string
}

export const resumeProfile = {
  basics: {
    name: "Yanhua He",
    location: "Toronto, ON",
    email: "yhe4940@outlook.com",
    phone: "647-657-3117",
    linkedin: "https://www.linkedin.com/in/yhe494",
    github: "https://github.com/yhe494",
    portfolio: "https://yanhuahe-portfolio-website.vercel.app/",
    summary:
      "Technical Support Specialist with experience troubleshooting software systems, debugging backend workflows, and supporting web applications. Familiar with Linux/Unix, Windows, and macOS environments, with foundational knowledge of TCP/IP networking. Strong problem-solving skills with a focus on diagnosing issues, resolving system errors, and improving reliability.",
  },
  experience: [
    {
      title: "Frontend Media Developer (Co-op)",
      organization: "Centennial College",
      location: "Toronto, ON",
      start: "2024-09",
      end: "2024-12",
      highlights: [
        "Evaluated and resolved 80+ web page accessibility issues using WAVE, ensuring compliance with WCAG standards across devices.",
        "Diagnosed and fixed layout and rendering issues using browser DevTools, improving cross-device compatibility.",
        "Customized WordPress templates and resolved content publishing issues in a CMS environment.",
        "Structured semantic HTML and CSS to address accessibility and readability issues flagged during audits.",
      ],
    },
    {
      title: "Backend Developer (Co-op)",
      organization: "AI Financial",
      location: "Richmond Hill, ON",
      start: "2024-01",
      end: "2024-04",
      highlights: [
        "Diagnosed and resolved data inconsistencies in 4,000+ Excel records processed through a Java Spring Boot batch system, reducing errors by 90%.",
        "Investigated and fixed failures in automated PDF generation workflows, reducing manual processing by 70%.",
        "Debugged third-party web portal interactions using Selenium, resolving automation failures in investment workflows.",
        "Analyzed logs and error reports to identify root causes of failed batch workflows, improving issue resolution efficiency.",
        "Managed code changes through GitHub pull requests, ensuring stable releases and minimizing production issues.",
      ],
    },
  ] satisfies ResumeExperience[],
  projects: [
    {
      title: "Job Applications Tracker",
      techStack: [
        "TypeScript",
        "React.js",
        "Express.js",
        "MongoDB",
        "REST APIs",
        "OpenAI API",
        "Docker",
        "Kubernetes",
      ],
      repository: "https://github.com/yhe494/Job-Tracker-App",
      highlights: [
        "Debugged and tested REST APIs using Postman, identifying and resolving authentication and validation issues.",
        "Diagnosed failures in OpenAI API integration, ensuring consistent and reliable AI-generated responses.",
        "Monitored and troubleshot application behavior in Docker and Kubernetes containerized environments.",
        "Implemented Zod schema validation and error handling to catch and surface API input issues early.",
        "Deployed and managed the app on a self-managed Kubernetes (k3s) cluster, resolving infrastructure and connectivity issues.",
      ],
    },
    {
      title: "Real-Time Chat Application",
      techStack: [
        "React",
        "Python",
        "FastAPI",
        "WebSockets",
        "PostgreSQL",
        "JWT",
        "Pydantic",
      ],
      repository: "https://github.com/yhe494/chatting-app",
      highlights: [
        "Diagnosed and resolved real-time connection failures in a WebSocket/FastAPI messaging system.",
        "Implemented reconnection logic with exponential backoff to handle network instability and dropped connections.",
        "Debugged JWT authentication and session issues across API and WebSocket communication layers.",
        "Tested system reliability under unstable network conditions to ensure a consistent user experience.",
      ],
    },
    {
      title: "Podcast Platform",
      techStack: [
        "ASP.NET",
        "AWS Elastic Beanstalk",
        "Amazon RDS",
        "Amazon S3",
        "Amazon DynamoDB",
        "SQL Server",
      ],
      repository: "https://github.com/yhe494/Podcast_Manage",
      highlights: [
        "Monitored and diagnosed deployment issues in a cloud-hosted AWS Elastic Beanstalk environment.",
        "Resolved data access issues across RDS, S3, and DynamoDB storage layers.",
        "Configured VPC networking, IAM policies, and security groups to secure cloud infrastructure.",
        "Debugged role-based access control issues and resolved user workflow failures in the admin panel.",
      ],
    },
  ] satisfies ResumeProject[],
  skills: [
    {
      category: "Operating Systems",
      items: ["Linux/Unix", "Windows", "macOS"],
    },
    {
      category: "Networking",
      items: ["TCP/IP fundamentals", "HTTP/HTTPS", "client-server architecture"],
    },
    {
      category: "Technical Support",
      items: ["Troubleshooting", "debugging", "log analysis", "issue reproduction"],
    },
    {
      category: "Languages",
      items: ["JavaScript", "Java", "Python", "SQL"],
    },
    {
      category: "Tools",
      items: ["Git", "Docker", "Postman", "Kubernetes"],
    },
  ] satisfies ResumeSkillGroup[],
  education: [
    {
      credential: "Advanced Diploma, Software Engineering Technology (Co-op)",
      institution: "Centennial College",
      location: "Toronto, ON",
      start: "2022-09",
      end: "2025-12",
      details: ["GPA: 4.37/4.5"],
    },
    {
      credential: "Bachelor of Science, Industrial Design",
      institution: "Wuyi University",
      location: "Jiangmen, China",
      start: "2017-09",
      end: "2021-06",
    },
  ] satisfies ResumeEducation[],
  courses: [] as ResumeCourse[],
}
