const t = {
  ';KhU': { name: 'Last Updated', type: 'last_edited_time' },
  '==~K': { name: 'Public', type: 'checkbox' },
  '=bhc': { name: 'Featured', type: 'checkbox' },
  'BN]P': {
    name: 'Tags',
    type: 'multi_select',
    options: [],
  },
}

t.find((x) => x.name === 'Tags')
