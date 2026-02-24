const siteSettings = {
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    { name: 'heroTitle', title: 'Hero Title', type: 'string' },
    { name: 'heroSubtitle', title: 'Hero Subtitle', type: 'text' },
    { name: 'about', title: 'About Me', type: 'array', of: [{ type: 'block' }] },
    { name: 'email', title: 'Contact Email', type: 'string' },
    { name: 'github', title: 'GitHub URL', type: 'url' },
    { name: 'linkedin', title: 'LinkedIn URL', type: 'url' },
  ],
}

export default siteSettings