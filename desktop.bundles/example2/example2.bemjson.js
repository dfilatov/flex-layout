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
                elem: 'panel',
                mods: { id: 'top' },
                js: { size: '50%' },
                elem: 'panel',
                content: [
                    { elem: 'resizer' },
                    {
                        block: 'flex-layout',
                        mods: { orient: 'horiz'},
                        content: [
                            { elem: 'panel', js: { size: '50%' }, content: [{ elem: 'panel-content' }, { elem: 'resizer' }]},
                            { elem: 'panel', mods: { primary : 'yes' }, content: { elem: 'panel-content' }}
                        ]
                    }
                ]
            },
            {
                elem: 'panel',
                mods: { primary: 'yes', id: 'middle' },
                content: {
                    block: 'flex-layout',
                    mods: { orient: 'horiz'},
                    content: [
                        { elem: 'panel', js: { size: '50%' }, content: [{ elem: 'panel-content' }, { elem: 'resizer' }]},
                        { elem: 'panel', mods: { primary : 'yes' }, content: { elem: 'panel-content' }}
                    ]
                }
            }
        ]
    }
})
