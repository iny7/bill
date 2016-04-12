//可以写成一个好用的html5本地存储插件

(function(){
	function App(){}
	//这里应该提供增删改查的封装方法
	App.prototype = {
		'reset' : function(){
			console.log("reset")
			localStorage.removeItem('bill');
			this.init();
		},
		'init' : function(){
			console.log('init')
			this.bill = localStorage.bill ? JSON.parse(localStorage.bill) : {
				'assets' : [],
				'liabilities' : [],
				'assetsCounter' : 0,
				'liabilitiesCounter' : 0
			};
			this.assets = this.bill.assets;
			this.liabilities = this.bill.liabilities;
			this.assetsCounter = this.bill.assetsCounter;
			this.liabilitiesCounter = this.bill.liabilitiesCounter;
		},
		'commit' : function(){
			var obj = {
				'assets' : this.assets,
				'liabilities' : this.liabilities,
				'assetsCounter' : this.assetsCounter,
				'liabilitiesCounter' : this.liabilitiesCounter
			}
			console.log("持久化之前的对象:"+obj)
			localStorage.bill = JSON.stringify(obj);
		},
		'getAllAssets' : function(){
			return this.assets;
		},
		'getAllLiabilities' : function(){
			return this.liabilities;
		},
		'addAsset' : function(asset){
			console.log('尝试添加资产')
			//以后要判断是否合法把??	
			// trim的正则
			// if (str.replace(/(^\s*)|(\s*$)/g,'') == "") {
			asset.value = parseInt(asset.value);
			var name = asset.name;
			var value = asset.value;
			if(name != null && $.trim(name) != '' && !isNaN(value)){
				this.assetsCounter = this.assetsCounter + 1;
				asset.id = this.assetsCounter;
				this.assets.push(asset);
				this.commit();
				console.log("资产添加成功")
				return true;
			}
			return false;
		},
		'addLiability' : function(liability){
			console.log('尝试添加负债')
			liability.value = parseInt(liability.value);
			var name = liability.name;
			var value = parseInt(liability.value);
			if(name != null && $.trim(name) != '' && !isNaN(value)){
				this.liabilitiesCounter = this.liabilitiesCounter + 1;
				liability.id = this.liabilitiesCounter;
				this.liabilities.push(liability);
				this.commit();
				console.log("负债添加成功")
				return true;
			}
			return false;
		},
		'editAsset' : function(asset){
			console.log("尝试修改资产"+asset.id)
			
			asset.value = parseInt(asset.value);
			var name = asset.name;
			var value = asset.value;
			var arr = this.assets;
			if(name != null && $.trim(name) != '' && !isNaN(value)){
				for(var i = 0 ; i < arr.length ; i ++){
					if(arr[i].id == asset.id){
						arr[i].name = asset.name;
						arr[i].value = asset.value;
						console.log("资产修改成功")
						this.commit();
						return true;
					}
				}
			}
			return false;
		},
		'editLiability' : function(liability){
			console.log("尝试修改负债,id为:"+liability.id)
			
			liability.value = parseInt(liability.value);
			var name = liability.name;
			var value = liability.value;
			var arr = this.liabilities;
			liability.value = parseInt(liability.value);
			if(name != null && $.trim(name) != '' && !isNaN(value)){
				for(var i = 0 ; i < arr.length ; i ++){
					if(arr[i].id == liability.id){
						arr[i].name = liability.name;
						arr[i].value = liability.value;
						console.log("负债修改成功")
						this.commit();
						return true;
					}
				}
			}
			return false;
			
		},
		'removeAsset' : function(id){
			console.log('尝试删除资产' + id);
			var arr = this.assets;
			for(var i = 0 ; i < arr.length ; i ++){
				if(arr[i].id == id){
					arr.splice(i, 1);
					console.log("资产删除成功")
					this.commit();
					return true;
				}
			}
			return false;
		},
		'removeLiability' : function(id){
			console.log('尝试删除负债' + id);
			var arr = this.liabilities;
			for(var i = 0 ; i < arr.length ; i ++){
				if(arr[i].id == id){
					arr.splice(i, 1);
					console.log("负债删除成功")
					this.commit();
					return true;
				}
			}
			return false

		}
	}

	window.bill = new App();
})()