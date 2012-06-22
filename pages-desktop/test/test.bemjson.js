({
    block: 'b-page',
    head: [
        { elem: 'css', url: 'test.css', ie: false },
        { block: 'i-jquery', elem: 'core' },
        { elem: 'js', url: 'test.js' }
    ],
    content: [
        {
            block : 'b-flex-layout',
            mods : { orient : 'vert', root : 'yes' },
            content : [
                { elem : 'panel', mods : { id : '1' }, js : { height : 100 }},
                {
                    elem : 'panel',
                    mods : { id : '2' },
                    js : { minHeight : 200 },
                    content : {
                        block : 'b-flex-layout',
                        mods : { orient : 'horiz' },
                        content : [
                            { elem : 'panel', mods : { id : '2-1' }, js : { width : '20%' }},
                            {
                                elem : 'panel',
                                mods : { id : '2-2' },
                                js : { minWidth : 200 },
                                content : {
                                    block : 'b-flex-layout',
                                    mods : { orient : 'vert' },
                                    content : [
                                        { elem : 'panel', mods : { id : '2-2-1' }, js : { minHeight : 50 }},
                                        { elem : 'panel', mods : { id : '2-2-2' }}
                                    ]
                                }
                            },
                            { elem : 'panel', mods : { id : '2-3' }, js : { width : 200 }}
                        ]
                    }
                },
                { elem : 'panel', mods : { id : '3' }, js : { height : '15%', minHeight : 50 }}
            ]
        }
    ]
})