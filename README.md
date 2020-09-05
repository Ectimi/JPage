# JPage

这是一个使用原生 js 实现的分页插件，没有其他冗余的功能，只有简简单单的切换页码功能，
由于使用原生 js 实现

### 使用方法
1.首先引入 css 和 js 文件 

2.调用构造函数 new JPage() 即可

### 效果图如下 
![效果图](https://github.com/Ectimi/JPage/blob/master/demo.gif)

可fork项目运行html查看效果

### 具体使用方法可查看 html 文件，

构造函数具体参数如下：
```javascript
/*
//默认配置
{
    container:'body',   //类名选择器，不填则默认把插件添加到body末尾,
    pageConfig: {
        current: 1,//当前页
        amount: 10,  //页码总数
        showNumber: 3,    //显示的页码个数
    }
}
*/

//具体代码
let page = new JPage({
    container: '.container',
    pageConfig: {
        current: 1,//当前页
        amount: 15,  //页码总数
        showNumber: 3,    //显示的页码个数
    }
})

//监听页数切换
page.onPageChange = currentPage => {
    console.log('当前页为：', currentPage)
}

```

如果需要修改样式，直接使用类名修改即可，如修改下一页按钮样式：
#page .next-btn{ 具体样式 }

此外，插件也提供了 setStyle 函数进行修改，用法如下：
```js
page.setStyle('.next-btn',{
    color:'red'
})
```


