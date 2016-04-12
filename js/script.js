//HTML5离线存储??实现真丶本地应用


//突然想起来有个一次绑定,读jquery的one源码!
//serialize  serializeArray是jquey方法,源码!
	//瞄了一眼源码,原来是对name属性进行筛选,filter一下checked什么的,那这个事不重要了,edit()实现功能!

// html5新API dom.dataset.id获取data-id
/*localStrorage存的是字符串!要进行JSON的字串和对象之间的转换*/
// 那么input的 value和setattribute value 有啥区别呢?

// 其实只利用localstorage也可以做json伪数据库登陆验证等的小应用呀!只不过只能本地玩
//首次登陆输入名字,存入localstorage,然后每次读取 呈现h1为XXX的记账本!

//添加的时候不让名称相同(或名字相同就合并) 强行让唯一,这样删除的时候就不会有问题了
// 用dom操作动态生成的a的href为啥会报跨域????(html里原先就有的就不会)
//原本想着就不用id了,在做编辑的时候发现还是需要维护一个id(通过维护一个计数器自增),埋到hidden或data(埋到a的data里是不是要好一点)里,一旦name发生改变,edit函数就不知道该改谁了


$(document).ready(function() {

	console.log(localStorage.bill)

	//测试数据
	var billObj = {
		assets : [
			{
				'id' : 1,
				'name' : '房子1',
				'value' : 200000
			},
			{
				'id' : 2,
				'name' : '房子2',
				'value' : 200000
			},
			{
				'id' : 3,
				'name' : '房子3',
				'value' : 200000
			}
		],
		'liabilities' : [
			{
				'id' : 1,
				'name' : '欠哥哥',
				'value' : 2000
			},
			{
				'id' : 2,
				'name' : '欠姐姐',
				'value' : 3000
			},
		],
		'assetsCounter' : 3,
		'liabilitiesCounter' : 2
	};
	var billString = JSON.stringify(billObj)
	localStorage.bill = billString
	var resetBtn = document.querySelector('#resetBtn');
	resetBtn.onclick = function(){
		if(confirm('确定要重置所有数据吗?')){
			bill.reset();
			updateView();	
		}
	}

	// bill相当于DAO层,负责数据的持久化
	bill.init();
	updateView();

});

function addItem(){
	var id = document.querySelector(".tab-pane.active").id;
	if(/assets/.test(id)){
		var form = document.querySelector('#add');
		//本身就是onclick进来的,还onclick干嘛 傻啊!
		// btn.onclick = function(event) {}
		var asset = {
			'name' : form.querySelector('#name').value,
			'value' : form.querySelector('#value').value
		}
		if(bill.addAsset(asset)){
			$(form).modal("hide");
			//这里刷新全局有损效率
			updateView();
		}else{
			alert("添加资产失败")
		}
	}else if(/liabilities/.test(id)){
		var form = document.querySelector('#add');
		var liability = {
			'name' : form.querySelector('#name').value,
			'value' : form.querySelector('#value').value
		}
		if(bill.addLiability(liability)){
			$(form).modal("hide");
			//这里刷新全局有损效率
			updateView();
		}else{
			alert("添加负债失败")
		}
		
	}
	//添加完以后要把input置空
	form.querySelector('#name').value = '';
	form.querySelector('#value').value = '';
}

// remove(this)是dom自带函数,会直接删除当前dom节点换名字 
//每次修改都要重新计算,是否可以用事件?
function removeItem(me){
	//根据dom结构获取本行的name和value
	var tdList = me.parentNode.parentNode.getElementsByTagName('td')
	var id = me.dataset.id;
	var parentNode = tdList[0].parentNode;
	while(parentNode){
		if(parentNode == assetsTable){
			//这里可不好用addListener了,因为每次编辑都会添加一个新事件,最后全乱套,要不用onclick,要不用form?
			//突然想起来有个一次绑定,读jquery的one源码!
			var form = document.querySelector('#remove');
			var btn = form.querySelector('#confirm');
			btn.onclick = function(event) {
				if(bill.removeAsset(id)){
					$(form).modal("hide");
					updateView();
				}else{
					alert('资产删除失败')
				}
			};
			break;
		}else if(parentNode == liabilitiesTable){
			var form = document.querySelector('#remove');
			var btn = form.querySelector('#confirm');
			btn.onclick = function(event) {
				if(bill.removeLiability(id)){
					$(form).modal("hide");
					updateView();
				}else{
					alert('负债删除失败')
				}
			}
			break;
		}
		parentNode = parentNode.parentNode;
	}
}
function edit(me){
	console.log(me)

	//根据dom结构获取本行的name和value
	var tdList = me.parentNode.parentNode.getElementsByTagName('td')
	var id = me.dataset.id;
	var name = tdList[0].innerHTML;
	var value = tdList[1].innerHTML;
	document.querySelector('#edit #name').value = name;
	document.querySelector('#edit #value').value = value;

	var assetsTable = document.querySelector('#assetsTable');
	var liabilitiesTable = document.querySelector('#liabilitiesTable')

	var parentNode = tdList[0].parentNode;
	while(parentNode){
		if(parentNode == assetsTable){
			//这里可不好用addListener了,因为每次编辑都会添加一个新事件,最后全乱套,要不用onclick,要不用form?
			//突然想起来有个一次绑定,读jquery的one源码!
			var form = document.querySelector('#edit');
			var btn = form.querySelector('#confirm');
			btn.onclick = function(event) {
				var asset = {
					'id' : id,
					'name' : form.querySelector('#name').value,
					'value' : form.querySelector('#value').value
				}
				if(bill.editAsset(asset)){
					$(form).modal("hide");
					//这里刷新全局有损效率
					updateView();
				}else{
					alert("修改资产失败")
				}
			};
			break;
		}else if(parentNode == liabilitiesTable){
			var form = document.querySelector('#edit');
			var btn = form.querySelector('#confirm');
			btn.onclick = function(event) {
				var liability = {
					'id' : id,
					'name' : form.querySelector('#name').value,
					'value' : form.querySelector('#value').value
				}
				if(bill.editLiability(liability)){
					$(form).modal("hide");
					updateView();
				}else{
					alert("修改负债失败")
				}
			}
			break;
		}
		parentNode = parentNode.parentNode;
	}

	// 改变value提交的form对象里没有,也不会呈现在html里,试试attr....attr也是jquery,迷了,用setAttribute通过
	// 仔细一看 原来问题的关键不是attr,而是name值没给 怪不得提交不过去
}


function updateView(){
	var money = 0;
	var assetsTable = document.getElementById('assetsTable').getElementsByTagName('tbody')[0];
	var assetsList = bill.getAllAssets();
	var assets = updateSection(assetsList, assetsTable);

	var liabilitiesTable = document.getElementById('liabilitiesTable').getElementsByTagName('tbody')[0];
	var liabilitiesList = bill.getAllLiabilities();
	var liabilities = updateSection(liabilitiesList, liabilitiesTable);

	var moneyNode = document.querySelector('#money');
	var allMoney = assets - liabilities;
	moneyNode.innerHTML = assets - liabilities;
	if(allMoney > 0){
		moneyNode.parentNode.className = 'alert alert-success';
	}else{
		moneyNode.parentNode.className = 'alert alert-danger';
	}
	document.getElementById('money').innerHTML = assets - liabilities;
}
function updateSection(list, tbody){
	var sum = 0;
	var title;
	if(tbody.parentNode.id == 'assetsTable'){
		title = '<tr><th>资产</th><th>金额</th><th></th></tr>';
	}else if(tbody.parentNode.id == 'liabilitiesTable'){
		title = '<tr><th>负债</th><th>金额</th><th></th></tr>';
	}
	tbody.innerHTML = title;
	for(var i = 0 ; i < list.length ; i ++){
		var elem = list[i];
		var id = elem.id;
		var name = elem.name;
		var value = elem.value;
		sum += value;
		var tr = document.createElement('tr');
		// 用动态生成的a的href为啥会报跨域????
		//这里不用这么麻烦,因为不是像上一个项目那种还要去数据库查编辑页面呈现的数据,而是所有input都可以从页面直接获得
		// var funcStr = "edit("+"'"+name+"'"+","+"'"+type+"'"+");";
		// console.log(funcStr)
		tr.innerHTML = '<td>'+name+'</td><td>'+value+'</td><td><a onclick="edit(this);" data-toggle="modal" data-target="#edit" data-id='+id+'>编辑</a> / <a onclick="removeItem(this);" data-toggle="modal" data-target="#remove" data-id='+id+'>删除</a></td>';
		tbody.appendChild(tr)
	}
	tbody.innerHTML +='<tr><td>总计</td><td>'+sum+'</td><td></td></tr>';
	return sum;

}