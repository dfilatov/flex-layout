({
    block: 'b-page',
    title: 'Layout',
    favicon: '/favicon.ico',
    head: [
        { elem: 'css', url: '_example2.css', ie: false },
        { elem: 'css', url: '_example2', ie: true },
        { block: 'i-jquery', elem: 'core' },
        { elem: 'js', url: '_example2.js' },
        { elem: 'meta', attrs: { name: 'description', content: '' }},
        { elem: 'meta', attrs: { name: 'keywords', content: '' }}
    ],
    content: {
        block: 'flex-layout',
        mods: { orient: 'vert', root: 'yes', theme: 'simple' },
        content: [
            {
                elem: 'pane',
                mods: { id: 'top' },
                js: { size: '50%' },
                elem: 'pane',
                content: [
                    { elem: 'resizer' },
                    {
                        block: 'flex-layout',
                        mods: { orient: 'horiz'},
                        content: [
                            { elem: 'pane', js: { size: '50%' }, content: [{ elem: 'pane-content' }, { elem: 'resizer' }]},
                            { elem: 'pane', mods: { primary : 'yes' }, content: { elem: 'pane-content' }}
                        ]
                    }
                ]
            },
            {
                elem: 'pane',
                mods: { primary: 'yes', id: 'middle' },
                content: {
                    block: 'flex-layout',
                    mods: { orient: 'horiz'},
                    content: [
                        { elem: 'pane', js: { size: '50%' }, content: [{ elem: 'pane-content' }, { elem: 'resizer' }]},
                        { elem: 'pane', mods: { primary : 'yes' }, content: { elem: 'pane-content' }}
                    ]
                }
            }
        ]
    }
})
