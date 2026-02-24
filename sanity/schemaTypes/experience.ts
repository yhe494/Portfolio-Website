const experience = {
  name: 'experience',
  title: 'Experience',
  type: 'document',
  fields: [
    { name: 'company', title: 'Company', type: 'string' },
    { name: 'location', title: 'Location', type: 'string' },
    { name: 'role', title: 'Role', type: 'string' },
    { name: 'startDate', title: 'Start Date', type: 'date' },
    { name: 'endDate', title: 'End Date', type: 'date' },
    { name: 'highlights', title: 'Highlights', type: 'array', of: [{ type: 'string' }] },
    { name: 'tech', title: 'Tech Used', type: 'array', of: [{ type: 'string' }] },
  ],
}

export default experience