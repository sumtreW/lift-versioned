/**
 * 演示程序当前的 “注册/登录” 等操作，是基于 “本地存储” 完成的
 * 当您要参考这个演示程序进行相关 app 的开发时，
 * 请注意将相关方法调整成 “基于服务端Service” 的实现。
 **/
(function($, owner) {
	
/**
	 * 用户登录
	 **/
	owner.login = function(loginInfo, callback) {
		if (plus.networkinfo.getCurrentType() == 1) {
			return callback('未检测的可用网络，请确认网络是否打开？');
				};
		callback = callback || $.noop;
		loginInfo = loginInfo || {};
		var paccount;
		var ppassword;
		loginInfo.account = loginInfo.account || '';
		loginInfo.password = loginInfo.password || '';

//		if (loginInfo.account.length != 3) {
//			return callback('账号长度为3个字符');
//		}
		//company ip
		//var url = "http://172.18.1.222:8080/test/snmp/add/" + loginInfo.account+"/"+loginInfo.password;
		// old ip
		//var url = "http://www.ycjwrq.com/WebService1.asmx/Login?pUserName=" + loginInfo.account + "&pUserPwd=" + loginInfo.password;
		//home ip
		var url = plus.storage.getItem("url")+"/h5plus/login?pUserName=" + loginInfo.account + "&pUserPwd=" + loginInfo.password;
<<<<<<< HEAD
//		alert(plus.storage.getItem("url"));
//		var url = "http://192.168.31.157:8080/h5plus/login?pUserName=" + loginInfo.account + "&pUserPwd=" + loginInfo.password;
=======
>>>>>>> 0751bba449433d07f3c173199abd3b499606622c
		var xhr = null;
		if (xhr) {
			return callback('XMLHttpRequest请求已创建');
		}
		xhr = new plus.net.XMLHttpRequest();
		xhr.onreadystatechange = function() {
			switch (xhr.readyState) {
				case 4:
					if (xhr.status == 200) {
						var data = eval('(' + xhr.responseText + ')');
						if (data != "0") {
							plus.storage.setItem("account", loginInfo.account);
							plus.storage.setItem("password", loginInfo.password);
							plus.storage.setItem("lastName", data.lastName);
							plus.storage.setItem("role", data.role.role);
							plus.storage.setItem("organization", data.organization.organizationName);
							plus.storage.setItem("organizationType",data.organization.organizationType);
							plus.storage.setItem("phone", data.phone);
							
							//alert(data.id);用户信息
							return callback();

						} else {
							return callback('用户名或密码错误');
						}
					} else {
						return callback('登录失败');
					}
					break;
				default:
					break;
			}
		}
		xhr.responseType = "json"
		xhr.open("get", url);
		xhr.send();

	}


	owner.createState = function(name, callback) {
		var state = owner.getState();
		state.account = name;
		state.token = "token123456789";
		owner.setState(state);
		return callback();
	};


	owner.editPass = function(editInfo, callback) {
		callback = callback || $.noop;
		editInfo = editInfo || {};
		editInfo.account = editInfo.account || '';
		editInfo.password = editInfo.password || '';
		if (editInfo.account.length!= 18) {
			return callback('账号长度为18个字符');
		}
		if (editInfo.password.length < 6) {
			return callback('密码最短需要 6 个字符');
		}
		//var url = "http://www.ycjwrq.com/WebService1.asmx/editPassword?pUserName=" + editInfo.account + "&pUserPwd=" + editInfo.password + "&pUseroldPwd=" + editInfo.oldpassword;
		//var url = "http://192.168.0.102:8080/h5plus/registration?email=achenspring@163.com";
		var url = plus.storage.setItem("url")+"/h5plus/registration?email=achenspring@163.com";
		var xhr = null;
		if (xhr) {
			return callback('xhr请求已创建');
		}
		xhr = new plus.net.XMLHttpRequest();
		xhr.onreadystatechange = function() {
			switch (xhr.readyState) {
				case 4:

					if (xhr.status == 200) {
						var data = eval('(' + xhr.responseText + ')');
<<<<<<< HEAD
						if (data.s == "1") {
=======
						alert(data);
						if (data.s == "1") {
							alert(data.s);
>>>>>>> 0751bba449433d07f3c173199abd3b499606622c
							return callback();
						}
						else if(data.s == "2"){
							return callback("原用户名或密码错误！");
						} else {
							return callback(data.s);
						}
					} else {
						return callback(xhr.responseText);
					}
					break;
				default:
					break;
			}
		}
		//xhr.Date={"id":4, "active":0, "email":'111', "name":'111', "lastName":'111', "phone":'111', "password":'111'}
		xhr.responseType = "json"
		xhr.open("GET", url);
		xhr.send();

	};



	/**
	 * 新用户注册
	 * There is already a user registered with the email provided
	 **/
	owner.reg = function(regInfo, callback) {
		callback = callback || $.noop;
		regInfo = regInfo || {};
		regInfo.account = regInfo.account || '';
		regInfo.password = regInfo.password || '';
		if (regInfo.account.length < 5) {
			return callback('用户名最短需要 5 个字符');
		}
		if (regInfo.password.length < 6) {
			return callback('密码最短需要 6 个字符');
		}
		if (!checkEmail(regInfo.email)) {
			return callback('邮箱地址不合法');
		}
		var users = JSON.parse(localStorage.getItem('$users') || '[]');
		users.push(regInfo);
		localStorage.setItem('$users', JSON.stringify(users));
		return callback();
	};

	/**
	 * 获取当前状态
	 **/
	owner.getState = function() {
		var stateText = localStorage.getItem('$state') || "{}";
		return JSON.parse(stateText);
	};

	/**
	 * 设置当前状态
	 **/
	owner.setState = function(state) {
		state = state || {};
		localStorage.setItem('$state', JSON.stringify(state));
		//var settings = owner.getSettings();
		//settings.gestures = '';
		//owner.setSettings(settings);
	};

	var checkEmail = function(email) {
		email = email || '';
		return (email.length > 3 && email.indexOf('@') > -1);
	};

	/**
	 * 找回密码
	 **/
	owner.forgetPassword = function(email, callback) {
		callback = callback || $.noop;
		if (!checkEmail(email)) {
			return callback('邮箱地址不合法');
		}
		return callback(null, '新的随机密码已经发送到您的邮箱，请查收邮件。');
	};

	/**
	 * 获取应用本地配置
	 **/
	owner.setSettings = function(settings) {
		settings = settings || {};
		localStorage.setItem('$settings', JSON.stringify(settings));
	}

	/**
	 * 设置应用本地配置
	 **/
	owner.getSettings = function() {
		var settingsText = localStorage.getItem('$settings') || "{}";
		return JSON.parse(settingsText);
	}
}(mui, window.app = {}));