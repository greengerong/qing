
    1 按照angular规范重命名变量，
         <del>1 module用小写加
         <del>2 controller首字母大写驼峰命名
         <del>3 service首字母小写驼峰命名
    <del>2  组件的可编辑，删除
    3  全流程review，设计，代码重构在内
    <del>4  对qing-add中的plugin罗列使用pluginsService.getAllPlugins返回值根据type=container/control自动生成
    <del>5  对文本Text可编辑容器的封装
    <del>6  对基本字符串input with label的封装(暂时提供正则类型)

    7  对于form类似于row-container的封装，可以设置form的显示方式，Bootstrap form样式罗列。标记修改qing-root-panel增加qing-plugin(设计器指令)
       plugin-data(原始值)。   ??bootstrap 3 form 对于input结构变化不一致。此task 暂定，先支持class="form-horizontal"
    8  select2实现带url或者一般option的选择框
    <del>9  radio button group(angular-ui btn-radio)
    <del>10 check button group
    11 autocomplete box
    12 提交button 带着url可以提交scope上的vm对象
    13 button的disabled关联其他控件的验证。
    14 对product的样式改进，考虑接口预留多theme的。
    15 对root-qing-panel上传入的url获取值赋值在vm上，并确保所有表单显示
    16 datepicker(angular-ui)
    17 日历
    <del>18 text-editor非设计器编辑 修正设计器获取html的逻辑;
    <doing> 19 对于plugin修改删除后以前的scope的影响的去除，比如checkbox/radio先设置某值为default 为Yes，
            后修改为No，这将存在上下问的影响；(目前解决方案可能是对每个plugin设计时候记录ng-model，在更新
            和删除时候delete掉;不考虑其他组件也许正在使用次ng-model)