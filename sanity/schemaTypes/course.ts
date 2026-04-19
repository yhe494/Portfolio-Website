const course = {
  name: 'course',
  title: 'Course',
  type: 'document',
  fields: [
    { name: 'title', title: 'Title', type: 'string' },
    { name: 'provider', title: 'Provider', type: 'string' },
    { name: 'completedDate', title: 'Completed Date', type: 'date' },
    { name: 'topics', title: 'Topics', type: 'array', of: [{ type: 'string' }] },
    { name: 'notes', title: 'Notes', type: 'array', of: [{ type: 'block' }] },
  ],
}

export default course

