let testApp = new Vue({
    el: "#app",
    data() {
        return data
    },
    mounted() {
        /*debugger*/
        let storage = window.localStorage
        let reqBtnNum = Number(storage.getItem("reqBtnNum"))
        this.haveStorage(reqBtnNum)
        // 按钮加载
        let curIndex = -1
        while (true) {
            curIndex++
            let reqBtnJson = storage.getItem(`reqBtn${curIndex}`)
            if (!reqBtnJson) {
                continue
            }
            reqBtnNum--
            let reqBtn = {}
            try {
                reqBtn = JSON.parse(reqBtnJson)
            } catch (err) {
                console.log(err)
                continue
            }
            // 启动数据自检，修复错误索引
            if (reqBtn.index !== curIndex) {
                reqBtn.index = curIndex
                storage.setItem(`reqBtn${curIndex}`,reqBtn)
            }

            this.buttonsRecordIndex.push(curIndex)
            this.buttonsNames.push(reqBtn.buttonName || "")
            this.buttonsUrls.push(reqBtn.buttonUrl || "")
            this.buttonsParams.push(reqBtn.buttonParams || "")
            this.buttonsWay.push(Number(reqBtn.buttonWay) || 0)
            this.reqResolvers.push(this.isJson(reqBtn.buttonParams)? 1 : 0 )
            if(reqBtnNum<1){
                break
            }
        }
        this.nextRecordIndex = curIndex + 1
        this.cssCalculate()
        window.addEventListener('mousemove', this.mousemoveHandle)
        window.addEventListener('resize', this.resizeHandle)
        window.addEventListener('contextmenu', this.menuHandle)
        window.addEventListener('click', this.clickHandle)
    },
    methods: {
        // 存在localStorage的情况下执行 情况vue中数据清空操作
        haveStorage(reqBtnNum){
            if (reqBtnNum>0){
                this.buttonsNames = []
                this.buttonsUrls = []
                this.buttonsWay = []
                this.buttonsParams = []
                this.reqResolvers = []
                this.buttonsRecordIndex = []
                this.recordLength = reqBtnNum
            }
        },
        // 新建请求按钮
        newForm() {
            this.resetForm()
            this.menuAction = 0
            this.showForm('新增请求按钮')
        },
        // 打开表单
        showForm(str) {
            this.formActiveName = str
            this.dialogFormVisible = true
        },
        // 表单输入中添加自定义键值对
        addCustomerParam() {
            this.form.moreKey.push("")
            this.form.moreValue.push("")
        },
        // 表单输入中删除自定义键值对
        deleteCustomerParam(index) {
            this.form.moreKey.splice(index, 1)
            this.form.moreValue.splice(index, 1)
        },
        // 修改按钮
        reqBtnAlter() {
            let index = this.onRightMenuBtnIndex
            this.resetForm()
            this.menuAction = 1
            this.form.title = this.buttonsNames[index]
            this.form.requestPath = this.buttonsUrls[index]
            this.requestWay = this.buttonsWay[index] + ""
            this.resolveWay = this.reqResolvers[index] + ""
            this.parseParams(this.buttonsParams[index])
            this.showForm('修改请求')
        },
        // 复制按钮
        reqBtnCopy() {
            this.resetForm()
            let index = this.onRightMenuBtnIndex
            this.form.title = this.buttonsNames[index] + '副本'
            this.form.requestPath = this.buttonsUrls[index]
            this.requestWay = this.buttonsWay[index] + ""
            this.previewText = this.buttonsParams[index]
            this.menuAction = 0
            this.submitFrom()
        },
        // 删除按钮
        reqBtnDel() {
            let index = this.onRightMenuBtnIndex
            this.buttonsNames.splice(index, 1)
            this.buttonsUrls.splice(index, 1)
            this.buttonsWay.splice(index, 1)
            this.buttonsParams.splice(index, 1)
            let recordIndex = this.buttonsRecordIndex[index]
            this.buttonsRecordIndex.splice(index, 1)
            let storage = window.localStorage
            storage.removeItem(`reqBtn${recordIndex}`)
            let length = storage.getItem('reqBtnNum');
            if (length) {
                storage.setItem('reqBtnNum', this.buttonsNames.length + "")
                this.recordLength--
            }
        },
        // 提交按钮-包括 新增、修改、复制 都是由改方法完成
        submitFrom() {
            // 记录索引
            let recordIndex = 0;
            // vue list索引
            let listIndex = 0;
            let del = 0;
            let isAdd = false
            // 0-新增复制的场合，1-修改的场合
            switch(this.menuAction){
                case 0:
                    isAdd = true
                    listIndex = this.buttonsNames.length+1
                    recordIndex = this.nextRecordIndex
                    del = 0
                    break
                case 1:
                    listIndex = this.onRightMenuBtnIndex
                    recordIndex = this.buttonsRecordIndex[listIndex]
                    if (recordIndex < 0) {
                        isAdd = true
                        recordIndex = this.nextRecordIndex
                    }
                    del = 1
                    break
            }

            this.buttonsNames.splice(listIndex, del, this.form.title)
            let reqWay = this.requestWay
            this.buttonsWay.splice(listIndex, del, Number(reqWay))
            if (reqWay === '0' && this.previewText) {
                this.form.requestPath += `?${this.previewText}`
                this.previewText = ''
                this.buttonsParams.splice(listIndex, del, '')
            } else {
                this.buttonsParams.splice(listIndex, del, this.previewText)
            }

            this.buttonsUrls.splice(listIndex, del, this.form.requestPath)
            this.buttonsRecordIndex.splice(listIndex, del, recordIndex)
            /*this.reqResolvers.splice(index, del, Number(this.resolveWay))*/
            let storage = window.localStorage
            let reqBtn = {
                index:recordIndex,
                buttonName: this.form.title, buttonUrl: this.form.requestPath,
                buttonWay: Number(reqWay), buttonParams: this.previewText
            }

            // 其实这里应该要用事务处理
            if (isAdd){
                this.recordLength++
                this.nextRecordIndex++
            }
            storage.setItem(`reqBtn${recordIndex}`, JSON.stringify(reqBtn))
            storage.setItem("reqBtnNum", this.recordLength + "")

            this.dialogFormVisible = false
        },
        formDataInputWatch() {
            let str = ''
            let bak = ''
            let form = this.form;
            if (form.userNo) {
                str += `userNo=${form.userNo}`
            }

            if (form.custNo && !str) {
                str = `custNo=${form.custNo}`
            } else if (form.custNo) {
                bak = `custNo=${form.custNo}`
            }

            if (str && bak) {
                str += `&${bak}`
                bak = ''
            }
            if (form.mobileNo && !str) {
                str = `mobileNo=${form.mobileNo}`
            } else if (form.mobileNo) {
                bak = `mobileNo=${form.mobileNo}`
            }

            if (str && bak) {
                str += `&${bak}`
                bak = ''
            }

            if (form.idCardNo && !str) {
                str = `IdCardNo=${form.idCardNo}`
            } else if (form.idCardNo) {
                bak = `IdCardNo=${form.idCardNo}`
            }

            if (str && bak) {
                str += `&${bak}`
                bak = ''
            }

            form.moreKey.forEach((key, index) => {
                if (!key) {
                    return false
                }
                if (!str) {
                    str = `${key}=${form.moreValue[index]}`
                } else {
                    bak = `${key}=${form.moreValue[index]}`
                }
                if (str && bak) {
                    str += `&${bak}`
                    bak = ''
                }
            })
            this.previewText = str
        },
        resetForm() {
            this.form = {
                title: '',
                requestPath: '',
                userNo: '',
                custNo: '',
                mobileNo: '',
                idCardNo: '',
                moreKey: [],
                moreValue: []
            }
            this.activeName = 'first'
            this.requestWay = '0'
            this.resolveWay = '0'
        },
        buttonQuery(index) {
            let url = this.buttonsUrls[index]
            let reqWay = this.buttonsWay[index]
            let method = this.wayEnums[reqWay]
            let type = this.positionsEnums[this.reqResolvers[index]]
            let data = this.buttonsParams[index]
            /*let reqPosition = this.reqResolvers[index]*/
            switch (method) {
                case 'get':
                    this.getQuery(method, url)
                    break;
                case 'post':
                    this.postQuery(method, url, data, type)
            }
        },
        getQuery(method, url) {
            axios({
                method: method,
                url: url,
                headers:{
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': true,
                }
            }).then((resp) => {
                this.responseHandle(resp, method)
            }).catch((err) => {
                this.responseHandle(err,method)
            })
        },
        postQuery(method, url, data, type) {
            axios({
                method: method,
                url: url,
                data: data,
                headers: {
                    'Content-Type': type
                }
            }).then((resp) => {
                this.responseHandle(resp, method)
            }).catch((err) => {
                this.responseHandle(err,method)
            })
        },
        responseHandle(resp, method) {
            let nowTime = new Date().Format("yyyy-MM-dd hh:mm:ss")
            let recordObj = {}
            recordObj['time'] = nowTime
            recordObj['method'] = (method || "unknown").toUpperCase()
            if (!resp) {
                recordObj['status'] = 'err'
                recordObj['statusText'] = 'ERR nil'
                this.saveRecordList.unshift(recordObj)
                this.saveRecord.unshift((resp || "Error null Response"))
                return
            } else if (resp.name === 'Error' && resp.response) {
                resp = resp.response
                resp.statusText = "ERR"
            } else if (!resp.data) {
                resp['status'] = 0
                resp['statusText'] = 'ERR'
            }
            recordObj['status'] = resp['status']
            recordObj['statusText'] = resp['statusText']
            this.saveRecordList.unshift(recordObj)

            let later = this.handleJsonKey(resp, true)
            let newOutput = JSON.stringify(later, null, "\t")
            newOutput = newOutput.replace(/\n/g, '<br>')
            newOutput = newOutput.replace(/\t/g, '<span class="json-tab"/>')
            newOutput += '<br><span style="text-align: center;display:block;">---------------------------- end ----------------------------</span>'
            this.saveRecord.unshift(newOutput)
            if (this.recentIndex > -1) {
                this.recentIndex++
            }
            if (typeof this.activeCollapse === 'number' && this.activeCollapse > -1) {
                this.activeCollapse++
            }
        },
        handleJsonKey(resp, flag) {
            let later = {}
            if (resp && typeof resp === 'object') {
                for (let key in resp) {
                    if (flag) {
                        if (key === 'request' || key === 'status' || key === 'statusText') {
                            continue
                        }
                    }
                    let newKey = `<span class='json-key'>${key}</span>`
                    let subEle = resp[key]
                    if (subEle && typeof subEle === 'object') {
                        later[newKey] = this.handleJsonKey(resp[key], false)
                    } else {
                        later[newKey] = subEle
                    }
                }
                return later
            }
            return resp;
        },
        getStatus(index) {
            let status = (this.saveRecordList[index].status || "").toString()
            if (status.startsWith("2")) {
                return 'greenP'
            } else if (status.startsWith("3")) {
                return 'yellowP'
            } else {
                return 'redP'
            }
        },
        recentLook(val) {
            console.log(val);
            console.log(typeof val);
            if (typeof val === 'number') {
                this.recentIndex = val
            }
        },
        cssCalculate() {
            this.centerPointerX = window.innerWidth / 2
            this.centerPointerY = window.innerHeight / 2
            this.topBar = Math.ceil(window.innerHeight * 0.2 * 0.5)
            this.jobHeight = Math.ceil(window.innerHeight * 0.8)
            this.rightJobHeight = this.jobHeight - 40
            this.jobReqHeight = this.jobHeight - 92
        },
        mousemoveHandle(event) {
            this.clientX = event.clientX
            this.clientY = event.clientY
        },
        resizeHandle(event) {
            this.cssCalculate()
        },
        menuHandle(event) {
            if (this.versionShow || this.dialogFormVisible) {
                return
            }
            this.onRightMenuBtnIndex = this.reqBtnOn
            this.menuDisabled = this.onRightMenuBtnIndex === -1 ? true : false

            if (this.clientX < this.centerPointerX && this.clientY < this.centerPointerY) {
                this.menuL = this.clientX + 'px'
                this.menuT = this.clientY + 'px'

                this.menuR = ''
                this.menuB = ''
            } else if (this.clientX > this.centerPointerX && this.clientY < this.centerPointerY) {
                this.menuR = (window.innerWidth - this.clientX) + 'px'
                this.menuT = this.clientY + 'px'

                this.menuL = ''
                this.menuB = ''
            } else if (this.clientX < this.centerPointerX && this.clientY > this.centerPointerY) {
                this.menuL = this.clientX + 'px'
                this.menuB = (window.innerHeight - this.clientY) + 'px'

                this.menuR = ''
                this.menuT = ''
            } else {
                this.menuR = (window.innerWidth - this.clientX) + 'px'
                this.menuB = (window.innerHeight - this.clientY) + 'px'

                this.menuL = ''
                this.menuT = ''
            }

            this.reqMenu = true
        },
        // 关闭右键菜单
        clickHandle() {
            this.reqMenu = false
        },
        reqBtnOver(index) {
            this.reqBtnOn = index
        },
        reqBtnOut() {
            this.reqBtnOn = -1
        },
        parseParams(paramsText) {
            let isJson = this.isJson(paramsText)
            if (!isJson){
                this.pairsParser(paramsText)
            }else {
                this.activeName = 'second'
                this.previewText =  paramsText
            }
        },
        isJson(paramsText){
            if (!paramsText){
                return false
            }
            try{
                let json = JSON.parse(paramsText)
                if (json && typeof json === 'object'){
                    return true
                }
                return false
            }catch (err) {
                return false
            }
        },
        //解析键值对形式的param
        pairsParser(paramsText) {
            if (!paramsText && this.form.requestPath.indexOf('?') > -1) {
                let urlArr = this.form.requestPath.split('?')
                paramsText = urlArr[1]
                this.form.requestPath = urlArr[0]
            }

            if (paramsText.indexOf('&') < -1){
                return
            }

            let pairs = paramsText.split('&')
            for (pair of pairs) {
                let keyValue = pair.split('=')
                let key = keyValue[0]
                if (!key) {
                    continue
                }
                let value = keyValue[1]
                switch (key) {
                    case 'userNo':
                        this.form.userNo = value
                        break
                    case 'custNo':
                        this.form.custNo = value
                        break
                    case 'mobileNo':
                        this.form.mobileNo = value
                        break
                    case 'IdCardNo':
                        this.form.idCardNo = value
                        break
                    default:
                        this.form.moreKey.push(key)
                        this.form.moreValue.push(value)
                }
            }
        },

    },
    computed: {},
    watch: {
        'form': {
            handler(val) {
                if(this.activeName === 'second'){
                    return
                }
                this.formDataInputWatch();
            },
            deep: true
        },
        'requestWay': {
            handler(val) {
                val === '0' ? this.getDisable = true : this.getDisable = false
            }
        },
    }
})


// date格式化
Date.prototype.Format = function (fmt) {
    let o = {
        "M+": this.getMonth() + 1,                 //月份
        "d+": this.getDate(),                    //日
        "h+": this.getHours(),                   //小时
        "m+": this.getMinutes(),                 //分
        "s+": this.getSeconds(),                 //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds()             //毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (let k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};

//屏蔽右键菜单
document.oncontextmenu = function (event) {
    return false;
}