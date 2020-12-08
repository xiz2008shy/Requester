let data = {
    wayEnums: ['get', 'post'],
    positionsEnums: ['application/x-www-form-urlencoded', 'application/json', 'text/plain'],

    //button属性
    buttonsNames: ['示例1-请求OtherInfo', '示例2-请求custody'],
    buttonsUrls: ['/crm-new/userInfo/otherInfo', '/crm-new/userInfo/custody/652201199804152706'],
    buttonsWay: [1, 0],
    buttonsParams: ['userNo=UR6003985526292484096&custNo=CT6003985568252301312&mobileNo=17804528420&IdCardNo=652201199804152706', ''],
    reqResolvers: [0, 0],
    buttonsRecordIndex:[-1,-1],
    recordLength: 0,

    output: '',
    saveRecord: [],
    saveRecordList: [],
    // 当前折叠面板
    activeCollapse: -1,
    // 最近查看面板索引
    recentIndex: -1,
    nextRecordIndex: -1,


    <!--css -->
    screenHeight: '0',
    borderRadius: '4px',
    jobHeight: 0,
    rightJobHeight: 0,
    jobReqHeight: 0,
    jobAddHeight: '92',
    topBar: '',
    halfWidth: '',
    formLabelWidth: '70px',
    menuDisabled: true,
    drawerWidth: '450px',

    <!--表单数据 -->
    getDisable: true,
    dialogFormVisible: false,
    activeName: 'first',
    requestWay: '0',
    resolveWay: '0',
    form: {
        title: '',
        requestPath: '',
        userNo: '',
        custNo: '',
        mobileNo: '',
        idCardNo: '',
        moreKey: [],
        moreValue: []
    },
    previewText: '',
    formActiveName:'',

    <!-- 鼠标事件 -->
    clientX: 0,
    clientY: 0,
    centerPointerX: 0,
    centerPointerY: 0,
    reqMenu: false,
    menuL: 0,
    menuR: 0,
    menuT: 0,
    menuB: 0,
    // 鼠标移动到请求按钮元素时赋值索引，移开时置为-1
    reqBtnOn: -1,
    // 鼠标右键触发时将当前reqBtnOn的值赋予该值，避免鼠标后续移动造成影响
    onRightMenuBtnIndex: -1,
    versionShow: false,
    // 0-新增/复制 1-修改
    menuAction: 0,
    btnTipsShow: 'none',
    btnTipsTop:0,
    btnTipsLeft:0,

    <!-- 侧边栏 -->
    drawer: false,
    basicUserQueryWay: '0'
}