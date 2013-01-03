({
    block: 'b-page',
    title: 'Title of the page',
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
            { elem: 'panel', mods: { id: '1' }, js: { size: 100, minHeight: 70, maxHeight: 150 }},
            { elem: 'splitter' },
            {
                elem: 'panel',
                mods: { id: '2' },
                js: { minHeight: 100 },
                content: {
                    block: 'flex-layout',
                    mods: { orient: 'horiz'},
                    content: [
                        { elem: 'panel', mods: { id: '2-1' }, js: { size: '20%', maxWidth: 200 }},
                        { elem: 'splitter' },
                        {
                            elem: 'panel',
                            mods: { id: '2-2' },
                            js: { minWidth: 300 },
                            content: {
                                block: 'flex-layout',
                                mods: { orient: 'vert' },
                                content: [
                                    { elem: 'panel', mods: { id: '2-2-1' }, js: { minHeight: 100 }},
                                    { elem: 'panel', mods: { id: '2-2-2' }, js: { size: '30%' }}
                                ]
                            }
                        }
                    ]
                }
            }
        ]
    }
})
