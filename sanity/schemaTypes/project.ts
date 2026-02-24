const project = {
    name: 'project',
    title: 'Project',
    type: 'document',
    fields: [
        {
            name: 'title',
            title: 'Title',
            type: 'string',
        },
        { name: 'summary', title: 'Summary', type: 'text' },
    { name: 'techStack', title: 'Tech Stack', type: 'array', of: [{ type: 'string' }] },
    { name: 'github', title: 'GitHub URL', type: 'url' },
    { name: 'featured', title: 'Featured', type: 'boolean' },
  ],
}

export default project
