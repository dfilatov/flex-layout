({
    block: 'b-page',
    title: 'Layout',
    favicon: '/favicon.ico',
    head: [
        { elem: 'css', url: '_index.css', ie: false },
        { elem: 'css', url: '_index', ie: true },
        { block: 'i-jquery', elem: 'core' },
        { elem: 'js', url: '_index.js' },
        { elem: 'meta', attrs: { name: 'description', content: '' }},
        { elem: 'meta', attrs: { name: 'keywords', content: '' }}
    ],
    content: {
        block: 'flex-layout',
        mods: { orient: 'vert', root: 'yes' },
        content: [
            { elem: 'panel', mods: { id: 'top' }, js: { size: 100, minHeight: 70, maxHeight: 200 }},
            { elem: 'splitter' },
            {
                elem: 'panel',
                mods: { id: 'middle' },
                js: { minHeight: 100 },
                content: {
                    block: 'flex-layout',
                    mods: { orient: 'horiz'},
                    content: [
                        { elem: 'panel', mods: { id: 'left' }, js: { size: '20%', minWidth: 100, maxWidth: 500 }},
                        { elem: 'splitter' },
                        {
                            elem: 'panel',
                            js: { minWidth: 300 },
                            content: {
                                block: 'flex-layout',
                                mods: { orient: 'vert' },
                                content: [
                                    { elem: 'panel', mods: { id: 'center' }, js: { minHeight: 100 }},
                                    { elem: 'panel', mods: { id: 'bottom' }, js: { size: '30%' }}
                                ]
                            }
                        }
                    ]
                }
            }
        ]
    }
})
