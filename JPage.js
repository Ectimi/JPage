class JPage {
    constructor({ container = 'body', pageConfig = {} }) {
        //默认配置
        let defaultConfig = {
            current: 1,//当前页
            amount: 10,  //页码总数
            showNumber: 3,    //显示的页码个数
        }

        this.$ = document.querySelector.bind(document)
        this.container = container
        this.pageConfig = Object.assign(defaultConfig, pageConfig) //合并配置
        this.showBeforeEllipses = false //是否显示前省略号
        this.showAfterEllipses = false //是否显示后省略号
        this.hides = [] //需要隐藏的页码

        //监听页码变化,可重新赋值更改函数
        this.onPageChange = () => { }
        this.init()
    }

    //创建元素
    createEl(type, properties) {
        let el = document.createElement(type);
        for (let key in properties) {
            el[key] = properties[key]
        }
        return el;
    }

    //超过6页才显示省略号，否则页码全部显示 
    needShowAllPageItem() {
        return this.pageConfig.amount <= 6;
    }

    //隐藏不需要显示的页码
    hidePageItem() {
        for (let i = 0, len = this.hides.length; i < len; i++) {
            this.$(`.page-${this.hides[i]}`).style.display = 'none'
        }
    }

    //显示页码
    showPageItem() {
        for (let i = 1; i <= this.pageConfig.amount; i++) {
            if (this.hides.indexOf(i) === -1) {
                this.$(`.page-${i}`).style.display = 'block'
            }
        }
    }

    //获取需要隐藏的页码
    getNeedHides() {
        if (!this.needShowAllPageItem()) {
            let currentPage = this.pageConfig.current
            this.hides = []
            if (currentPage + this.pageConfig.showNumber > this.pageConfig.amount) {
                for (let i = 1; i < this.pageConfig.amount - this.pageConfig.showNumber + 1; i++) {
                    this.hides.push(i)
                }
                this.showBeforeEllipses = true;
                this.showAfterEllipses = false
            } else {
                if (currentPage === 1) {
                    for (let i = currentPage + this.pageConfig.showNumber; i <= this.pageConfig.amount; i++) {
                        this.hides.push(i)
                    }
                    this.showBeforeEllipses = false;
                    this.showAfterEllipses = true;
                } else {
                    for (let i = 1; i < currentPage; i++) {
                        this.hides.push(i)
                    }
                    for (let i = currentPage + this.pageConfig.showNumber; i <= this.pageConfig.amount; i++) {
                        this.hides.push(i)
                    }
                    this.showBeforeEllipses = true;
                    this.showAfterEllipses = true;
                }
            }
        }
    }

    //切换显示省略号
    toggleEllipses() {
        if (this.showBeforeEllipses) {
            this.$('.before-ellipses').style.display = 'block'
        } else {
            this.$('.before-ellipses').style.display = 'none'
        }

        if (this.showAfterEllipses) {
            this.$('.after-ellipses').style.display = 'block'
        } else {
            this.$('.after-ellipses').style.display = 'none'
        }
    }

    //高亮当前页
    heightLightCurrentPage() {
        this.$('.current').classList.remove('current')
        this.$(`.page-${this.pageConfig.current}`).classList.add('current')
    }

    //下一页
    nextPage = () => {
        if (this.pageConfig.current + 1 > this.pageConfig.amount) return
        let page = this.pageConfig.current + 1;
        this.pageConfig.current = page > this.pageConfig.amount ? 1 : page
        this.switchPage()
    }

    //上一页
    prevPage = () => {
        if (this.pageConfig.current - 1 === 0) return
        let page = this.pageConfig.current - 1;
        this.pageConfig.current = page === 0 ? this.pageConfig.amount : page
        this.switchPage()
    }

    //构造html结构
    createTemplate() {
        /*
            构造以下html结构
                <div id="page">
                    <ul class="page-wrapper">
                        <li class="prev-btn">上一页</li>
                        <li class="page-item before-ellipses">...</li>
                        <li class="page-item page-1 current" data-page="1">1</li>
                        <li class="page-item page-2" data-page="2">2</li>
                        ...
                        <li class="page-item after-ellipses">...</li>
                        <li class="next-btn">下一页</li>
                    </ul>
                </div> 
        */
        let frag = document.createDocumentFragment()
        let page_div = this.createEl('div', { id: 'page' })
        let ul = this.createEl('ul', {
            className: 'page-wrapper'
        })
        let prev_btn_li = this.createEl('li', {
            className: 'prev-btn',
            innerText: '上一页'
        })
        let next_btn_li = this.createEl('li', {
            className: 'next-btn',
            innerText: '下一页'
        })
        let before_ellipses_li = this.createEl('li', {
            className: 'page-item before-ellipses',
            innerText: '...'
        })
        let after_ellipses_li = this.createEl('li', {
            className: 'page-item after-ellipses',
            innerText: '...'
        })

        ul.append(prev_btn_li)
        ul.append(before_ellipses_li)

        for (let i = 1, len = this.pageConfig.amount; i <= len; i++) {
            let page_item_li
            if (i === 1) {
                page_item_li = this.createEl('li', {
                    className: `page-item page-${i} current`,
                    innerText: i
                })
            } else {
                page_item_li = this.createEl('li', {
                    className: `page-item page-${i}`,
                    innerText: i
                })
            }
            page_item_li.setAttribute('data-page-number', i)
            ul.append(page_item_li)
        }

        ul.append(after_ellipses_li)
        ul.append(next_btn_li)
        page_div.append(ul)
        frag.append(page_div)

        if (this.container === 'body'||!this.container) {
            document.body.append(frag)
        } else {
            this.$(this.container).append(frag)
        }
    }

    //检测上一页、下一页按钮是否可用，不可用则添加 disable 样式
    checkDisable() {
        //如果第一页是当前页，则上一页按钮添加 disable 样式
        if (this.$('.page-1').classList.contains('current')) {
            this.$('.prev-btn').classList.add('disable')
        } else {
            this.$('.prev-btn').classList.remove('disable')
        }

        //如果最后一页是当前页，则把下一页按钮添加 disable 样式
        if (this.$(`.page-${this.pageConfig.amount}`).classList.contains('current')) {
            this.$('.next-btn').classList.add('disable')
        } else {
            this.$('.next-btn').classList.remove('disable')
        }
    }

    //切换页码
    switchPage() {
        this.getNeedHides()
        this.hidePageItem()
        this.showPageItem()
        this.toggleEllipses()
        this.heightLightCurrentPage()
        this.checkDisable()
        this.onPageChange(this.pageConfig.current)
    }

    init() {
        document.onreadystatechange = () => {
            //页面加载完毕时执行
            if (document.readyState === "interactive") {
                this.createTemplate()
                this.$('.next-btn').addEventListener('click', this.nextPage)
                this.$('.prev-btn').addEventListener('click', this.prevPage)
                this.$('.page-wrapper').onclick = e => {
                    let current = Number(e.target.dataset.pageNumber)
                    if (current && current !== this.pageConfig.current) {
                        this.pageConfig.current = current
                        this.switchPage()
                    }

                    if (e.target.classList.contains('after-ellipses')) {
                        let page = this.pageConfig.current + 2;
                        this.pageConfig.current = page > this.pageConfig.amount ? this.pageConfig.amount : page;
                        this.switchPage()
                    }

                    if (e.target.classList.contains('before-ellipses')) {
                        let page = this.pageConfig.current - 2;
                        this.pageConfig.current = page <= 0 ? 1 : page;
                        this.switchPage()
                    }
                }
                this.switchPage()
            }
        }
    }
}
