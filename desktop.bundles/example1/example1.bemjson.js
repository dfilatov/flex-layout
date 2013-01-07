({
    block: 'b-page',
    title: 'Layout',
    favicon: '/favicon.ico',
    head: [
        { elem: 'css', url: '_example1.css', ie: false },
        { elem: 'css', url: '_example1', ie: true },
        { block: 'i-jquery', elem: 'core' },
        { elem: 'js', url: '_example1.js' },
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
                js: { size: 100, minHeight: 70, maxHeight: 200 },
                content: [
                    { elem: 'panel-content' },
                    { elem: 'resizer' },
                    { elem: 'collapser' }
                ]
            },
            {
                elem: 'panel',
                mods: { primary: 'yes', id: 'middle' },
                js: { minHeight: 100 },
                content: {
                    block: 'flex-layout',
                    mods: { orient: 'horiz'},
                    content: [
                        {
                            elem: 'panel',
                            mods: { id: 'left' },
                            js: { size: '20%', minWidth: 100, maxWidth: 500 },
                            content: [
                                { elem: 'panel-content' },
                                { elem: 'resizer' },
                                { elem: 'collapser' }
                            ]
                        },
                        {
                            elem: 'panel',
                            mods: { primary : 'yes' },
                            content: {
                                block: 'flex-layout',
                                mods: { orient: 'horiz'},
                                content: [
                                    {
                                        elem: 'panel',
                                        mods: { primary : 'yes' },
                                        js: { minWidth: 300 },
                                        content: {
                                            block: 'flex-layout',
                                            mods: { orient: 'vert' },
                                            content: [
                                                { elem: 'panel', mods: { primary: 'yes', id: 'center' }, js: { minHeight: 100 }},
                                                {
                                                    elem: 'panel',
                                                    mods: { id: 'bottom' },
                                                    js: { size: '30%' },
                                                    content: [
                                                        { elem: 'panel-content' },
                                                        { elem: 'collapser' }
                                                    ]
                                                }
                                            ]
                                        }
                                    },
                                    {
                                        elem: 'panel',
                                        mods: { id: 'right' },
                                        js: { size: '25%', minWidth: 100, maxWidth: 500 },
                                        content: [
                                            { elem: 'panel-content' },
                                            { elem: 'resizer' },
                                            { elem: 'collapser' }
                                        ]
                                    }
                                ]
                            }
                        }
                    ]
                }
            }
        ]
    }
})
