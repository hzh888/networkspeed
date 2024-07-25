// 初始化layui
layui.use(['form', 'slider', 'jquery'], function() {
	var form = layui.form,
		layer = layui.layer,
		$ = layui.jquery,
		slider = layui.slider;


	// 监听表单提交
	form.on('submit(submitBtn)', function(data) {
		// 获取表单数据
		var formData = data.field;

		// TODO: 在这里添加你的表单提交逻辑

		return false; // 阻止表单提交
	});



	$(document)
		.ready(function() {
			// 获取公告内容
			$.getJSON('https://api.fxgnt.cn/notice.php', function(data) {
				var announcement = data;
				var lastAnnouncement = localStorage.getItem('lastAnnouncement');
				var lastAnnouncementDate = localStorage.getItem('lastAnnouncementDate');
				var today = new Date()
					.toLocaleDateString();

				// 判断公告状态是否为 "开"
				if (announcement.status === "开") {
					// 如果公告内容有更新或者当天未弹过
					if (lastAnnouncement !== announcement.content || lastAnnouncementDate !== today) {
						// 显示layui弹窗
						layer.open({
							type: 1,
							title: announcement.title,
							content: announcement.content,
							closeBtn: 0,
							btnAlign: 'c',
							moveType: 1,
							area: '300px;',
							btn: ['确定'],
							yes: function(index, layero) {
								layer.close(index);
							}
						});

						// 更新LocalStorage
						localStorage.setItem('lastAnnouncement', announcement.content);
						localStorage.setItem('lastAnnouncementDate', today);
					}
				}
			});
		});





	var myChart = echarts.init(document.getElementById('dv'));
	var option;

	option = {
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'cross',
				label: {
					backgroundColor: '#6a7985',
				}
			},
			formatter: function(params) {
				var date = new Date(params[0].data.value[0]);
				var formattedDate = date.getFullYear() + '-' +
					(date.getMonth() + 1)
					.toString()
					.padStart(2, '0') + '-' +
					date.getDate()
					.toString()
					.padStart(2, '0') + ' ' +
					date.getHours()
					.toString()
					.padStart(2, '0') + ':' +
					date.getMinutes()
					.toString()
					.padStart(2, '0') + ':' +
					date.getSeconds()
					.toString()
					.padStart(2, '0');
				var result = formattedDate + '<br/>';
				params.forEach(function(item) {
					result += item.seriesName + ' : ' + item.value[1] + '<br/>';
				});
				return result;
			}
		},
		legend: {
			data: ['Speed']
		},
		grid: {
			left: '3%',
			right: '4%',
			bottom: '5%',
		    top: '7%',
			containLabel: true,
		},
		xAxis: [{
			type: 'time',
			boundaryGap: false,
			axisLabel: {
				show: false,
				formatter: function(value) {
					var date = new Date(value);
					return date.getHours()
						.toString()
						.padStart(2, '0') + ':' +
						date.getMinutes()
						.toString()
						.padStart(2, '0') + ':' +
						date.getSeconds()
						.toString()
						.padStart(2, '0');
				}
			},
			axisTick: {
				show: false
			},
			axisPointer: {
				show: true,
				type: 'line',
				label: {
					show: false,
				},
				lineStyle: {
					color: '#696969', // 线的颜色
					width: 1.1, // 线的宽度
				}
			},
		}],
		yAxis: [{
			type: 'value',
			splitLine: {
				show: false,
			},
			axisTick: {
				show: false,
			},
			axisLabel: {
				show: true,
				interval: "auto",
				margin: 8,
				formatter: function(value, index) {
					return value + currentUnit;
				}
			},
			axisPointer: {
				show: false,
				label: {
					show: false,
				},
			}
		}],
		series: [{
			name: '速率',
			type: 'line',
			stack: 'Total',
			smooth: true,
			yAxisIndex: 0,
			areaStyle: {},
			symbol: "none",
			emphasis: {
				focus: 'series',
			},
			itemStyle: {
				color: '#16BAAA', // 线条颜色
				areaStyle: {
					color: '#16BAAA', // 填充颜色
				}
			},
			data: [{
				name: new Date(),
				value: [new Date()
					.getTime(), now_global_ping
				]
			}]
		}]
	};

	option && myChart.setOption(option);

	var timerId;
	var maxDataPoints = 80; // 最大数据点数

	function dv() {
		if (visibl) {
			var now = new Date();
			option.series[0].data.push({
				name: now.toString(),
				value: [now.getTime(), now_speed.toFixed(1)]
			});

			if (option.series[0].data.length > maxDataPoints) {
				option.series[0].data.shift(); // 移除最早的数据点
			}

			myChart.setOption({
				series: option.series
			});
		}
		timerId = setTimeout(dv, 1000);
	}

	function stopDv() {
		clearTimeout(timerId);
	}

	$('#dvv')
		.click(function() {
			var linkText = $(this)
				.text();
			if (linkText === '开启图表') {
				$(this)
					.text('关闭图表');
				dv();
			} else {
				$(this)
					.text('开启图表');
				stopDv();
			}
		});






	// 网页加载完成后，自动将showMax输入框的值设置为10，并执行setMax函数
	window.onload = function() {
		var inputBox = document.getElementById('showMax');
		inputBox.value = '10';
		setMax(inputBox.value);
	};





	// 监听开关状态改变事件
	form.on('switch(switchtest1)', function(data) {
		// 如果开关被打开
		if (data.elem.checked) {
			// 弹出确认框，并保存弹窗索引
			var index = layer.confirm('<div style="text-align:center;"><p style="color:red;">确定要开启不限制流量吗？</p><p style="color:red;">这将会无限制一直消耗流量！</p></div>', {
				title: '提示',
				closeBtn: 0,
				btn: ['确定', '取消'] //按钮
			}, function() {
				// 用户点击了确定
				// 隐藏整个layui-form-item元素
				document.getElementById('flowLimit')
					.style.display = 'none';
				// 清空输入框
				var inputBox = document.getElementById('showMax');
				inputBox.value = '';
				// 读取输入框的值并执行showMax函数
				var inputValue = inputBox.value;
				setMax(inputValue);
				// 关闭弹窗
				layer.close(index);
			}, function() {
				// 用户点击了取消，重置开关状态并关闭确认框
				data.elem.checked = false;
				form.render();
				layer.close(index);
			});
		} else {
			var inputBox = document.getElementById('showMax');
			inputBox.value = '10';
			setMax(inputBox.value);
			// 开关被关闭，显示整个layui-form-item元素
			document.getElementById('flowLimit')
				.style.display = '';
		}
	});



	$('#editButton')
		.click(function() {
			layer.prompt({
				formType: 0,
				title: '流量单位(GB)',
				placeholder: '请输入需要限制的流量',
				btn: ['确定', '取消'],
				closeBtn: 0,
				yes: function(index, layero) {
					var value = layero.find('.layui-layer-input')
						.val();
					if (value <= 0) {
						layer.msg('请输入大于0的数', {
							icon: 7
						});
						return false; // 阻止弹出层关闭
					}
					setMax(value);
					layer.close(index);
				}
			});
		});


	// 初始化滑块
	slider.render({
		elem: '#slider',
		min: 1,
		max: 96,
		value: 8,
		theme: '#6495ED',
		input: true,
		change: function(value) {
			document.getElementById('thread')
				.value = value;
		},
		setTips: function(value) {
			return value + '线程';
		}
	});







	// 动态添加选项到下拉框
	var select = document.getElementById("select");
	var linkInput = document.getElementById("link");
	var response; // 存储下拉框数据

	// 使用AJAX从PHP接口获取下拉框数据
	var xhr = new XMLHttpRequest();
	xhr.open("POST", "https://api.fxgnt.cn/jk.php?cache=net.fxgnt.cn", true);
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

	// 弹出加载中的提示信息
	var loadIndex = layer.msg('获取云节点中', {
		icon: 16,
		shade: 0.01
	});

	xhr.onreadystatechange = function() {
		if (xhr.readyState === XMLHttpRequest.DONE) {
			// 请求完成，关闭加载提示信息
			layer.close(loadIndex);

			if (xhr.status === 200) {
				response = JSON.parse(xhr.responseText);
				for (var group in response) {
					var optgroup = document.createElement('optgroup');
					optgroup.label = group;
					for (var area in response[group]) {
						var optionText = area;
						if (response[group][area].status === "开") {
							optionText += " (维护中)";
						}
						var option = new Option(optionText, area);
						if (response[group][area].status !== "关") {
							option.disabled = true;
						}
						optgroup.appendChild(option);
					}
					select.appendChild(optgroup);
				}
				// 重新渲染下拉框
				layui.form.render('select');
			} else {
				layer.msg('云节点获取失败', {
					icon: 5
				});
			}
		}
	};

	xhr.send();






	// 监听选择框变化
	form.on('select(select)', function(data) {
		var inputBlock = document.getElementById('inputBlock'); // 获取输入框元素

		// 使用JSON对象来设置测速链接
		for (var group in response) {
			if (response[group][data.value]) {
				linkInput.value = response[group][data.value].link;
				break;
			} else {
				linkInput.value = ""; // 清空
			}
		}

		// 如果选择了"自定义链接"，则显示输入框，否则隐藏输入框
		if (data.value === "自定义链接") {
			inputBlock.style.display = "block";
		} else {
			inputBlock.style.display = "none";
		}

		// 重新渲染输入框
		form.render('input');
	});




	// 正确初始化Layui表单监听
	form.render();






	function musiccontrol() {
		if (/Mobi|Android|iPhone/i.test(navigator.userAgent)) {
			if ($('#customSwitch2')
				.prop('checked')) {
				$('#music')[0].play();
				$('#customSwitch2')
					.next()
					.removeClass('layui-form-onswitch')
					.addClass('layui-form-offswitch'); // 使用 layui 的方式修改按钮状态为关闭
			} else {
				$('#music')[0].pause();
				$('#customSwitch2')
					.next()
					.removeClass('layui-form-offswitch')
					.addClass('layui-form-onswitch'); // 使用 layui 的方式修改按钮状态为打开
			}
		}
	}

	form.on('switch(switchtest2)', function(data) {
		musiccontrol(); // 当开关状态改变时调用 musiccontrol 函数
	});

	$('#music')
		.on('pause', function() {
			document.title = '网络测速';
			if (run && !visibl) botton_clicked();
			$('#customSwitch2')
				.prop('checked', false);
			$('#customSwitch2')
				.next()
				.removeClass('layui-form-onswitch')
				.addClass('layui-form-offswitch'); // 使用 layui 的方式修改按钮状态为关闭
		});

	$('#music')
		.on('play', function() {
			if (!(run || visibl)) botton_clicked();
			$('#customSwitch2')
				.prop('checked', true);
			$('#customSwitch2')
				.next()
				.removeClass('layui-form-offswitch')
				.addClass('layui-form-onswitch'); // 使用 layui 的方式修改按钮状态为打开
		});

	$(document)
		.on("visibilitychange", function() {
			var string = document.visibilityState;
			if (string === 'hidden') {
				visibl = false;
				if (run && !$('#customSwitch2')
					.prop('checked')) botton_clicked();
			}
			if (string === 'visible') {
				visibl = true;
				document.title = "网络测速";
			}
		});


});



var maxtheard;
var testurl;
var lsat_date = 0;
var CountryCode_Zh_cn = {
	"US": "美国",
	"CA": "加拿大",
	"HK": "中国香港",
	"TW": "中国台湾",
	"SG": "新加坡",
	"JP": "日本",
	"KR": "韩国",
	"AU": "澳大利亚",
	"NZ": "新西兰",
	"AF": "阿富汗",
	"AL": "阿尔巴尼亚",
	"DZ": "阿尔及利亚",
	"AS": "美属萨摩亚(美国)",
	"AD": "安道尔",
	"AO": "安哥拉",
	"AI": "安圭拉",
	"AG": "安提瓜和巴布达",
	"AR": "阿根廷",
	"AM": "亚美尼亚",
	"AW": "阿鲁巴",
	"AT": "奥地利",
	"AZ": "阿塞拜疆",
	"BS": "巴哈马",
	"BH": "巴林",
	"BD": "孟加拉国",
	"BB": "巴巴多斯",
	"BY": "白俄罗斯",
	"BE": "比利时",
	"BZ": "伯利兹",
	"BJ": "贝宁",
	"BM": "百慕大",
	"BT": "不丹",
	"BO": "玻利维亚",
	"BA": "波黑",
	"BW": "博茨瓦纳",
	"BR": "巴西",
	"VG": "英属维京群岛(英国)",
	"BN": "文莱",
	"BG": "保加利亚",
	"BF": "布基纳法索",
	"BI": "布隆迪",
	"KH": "柬埔寨",
	"CM": "喀麦隆",
	"CV": "佛得角",
	"KY": "开曼群岛(英国)",
	"CF": "中非共和国",
	"TD": "乍得",
	"CL": "智利",
	"CO": "哥伦比亚",
	"KM": "科摩罗",
	"CD": "刚果(金)",
	"CK": "库克群岛(新西兰)",
	"CR": "哥斯达黎加",
	"CI": "科特迪瓦",
	"HR": "克罗地亚",
	"CU": "古巴",
	"CY": "塞浦路斯",
	"CZ": "捷克",
	"DK": "丹麦",
	"DJ": "吉布提",
	"DM": "多米尼克",
	"DO": "多米尼加共和国",
	"EC": "厄瓜多尔",
	"EG": "埃及",
	"SV": "萨尔瓦多",
	"GQ": "赤道几内亚",
	"ER": "厄立特里亚",
	"EE": "爱沙尼亚",
	"ET": "埃塞俄比亚",
	"FO": "法罗群岛(丹麦)",
	"FJ": "斐济",
	"FI": "芬兰",
	"FR": "法国",
	"GF": "法属圭亚那(法国)",
	"PF": "法属玻利尼西亚",
	"GA": "加蓬",
	"GM": "冈比亚",
	"GE": "格鲁吉亚",
	"DE": "德国",
	"GH": "加纳",
	"GI": "直布罗陀(英国)",
	"GR": "希腊",
	"GL": "格陵兰",
	"GD": "格林纳达",
	"GP": "瓜德罗普",
	"GU": "关岛(美国)",
	"GT": "危地马拉",
	"GN": "几内亚",
	"GW": "几内亚比绍",
	"GY": "圭亚那",
	"HT": "海地",
	"HN": "洪都拉斯",
	"HU": "匈牙利",
	"IS": "冰岛",
	"IN": "印度",
	"ID": "印度尼西亚",
	"IR": "伊朗",
	"IQ": "伊拉克",
	"IE": "爱尔兰共和国",
	"IL": "以色列",
	"IT": "意大利",
	"JM": "牙买加",
	"JO": "约旦",
	"KZ": "哈萨克斯坦",
	"KE": "肯尼亚",
	"KI": "基里巴斯",
	"KP": "北朝鲜",
	"KW": "科威特",
	"KG": "吉尔吉斯斯坦",
	"LA": "老挝",
	"LV": "拉脱维亚",
	"LB": "黎巴嫩",
	"LS": "莱索托",
	"LR": "利比里亚",
	"LY": "利比亚",
	"LI": "列支敦士登",
	"LT": "立陶宛",
	"LU": "卢森堡",
	"MO": "中国澳门",
	"MK": "马其顿",
	"MG": "马达加斯加",
	"MW": "马拉维",
	"MY": "马来西亚",
	"MV": "马尔代夫",
	"ML": "马里共和国",
	"MT": "马耳他",
	"MH": "马绍尔群岛",
	"MQ": "马提尼克(法国)",
	"MR": "毛里塔尼亚",
	"MU": "毛里求斯",
	"YT": "马约特",
	"MX": "墨西哥",
	"FM": "密克罗尼西亚联邦",
	"MD": "摩尔多瓦",
	"MC": "摩纳哥",
	"MN": "蒙古国",
	"ME": "黑山共和国",
	"MS": "蒙塞拉特岛(英国)",
	"MA": "摩洛哥",
	"MZ": "莫桑比克",
	"MM": "缅甸",
	"NA": "纳米比亚",
	"NR": "瑙鲁",
	"NP": "尼泊尔",
	"599": "荷属安的列斯",
	"NL": "荷兰",
	"NC": "新喀里多尼亚(法国)",
	"NI": "尼加拉瓜",
	"NE": "尼日尔",
	"NG": "尼日利亚",
	"NU": "纽埃",
	"MP": "北马里亚纳群岛(美国)",
	"NO": "挪威",
	"OM": "阿曼",
	"PK": "巴基斯坦",
	"PW": "帕劳",
	"PS": "巴勒斯坦",
	"PA": "巴拿马",
	"PG": "巴布亚新几内亚",
	"PY": "巴拉圭",
	"CN": "中国",
	"PE": "秘鲁",
	"PH": "菲律宾",
	"PL": "波兰",
	"PT": "葡萄牙",
	"PR": "波多黎各(美国)",
	"QA": "卡塔尔",
	"CG": "刚果共和国",
	"ZW": "津巴布韦",
	"RE": "留尼汪(法国)",
	"RO": "罗马尼亚",
	"RU": "俄罗斯",
	"RW": "卢旺达",
	"SH": "圣赫勒拿",
	"KN": "圣基茨和尼维斯",
	"LC": "圣卢西亚",
	"PM": "圣皮埃尔和密克隆岛(法国)",
	"VC": "圣文森特和格林纳丁斯",
	"WS": "萨摩亚",
	"SM": "圣马力诺",
	"ST": "圣多美和普林西比",
	"SA": "沙特阿拉伯",
	"SN": "塞内加尔",
	"RS": "塞尔维亚共和国",
	"SC": "塞舌尔",
	"SL": "塞拉利昂",
	"SK": "斯洛伐克",
	"SI": "斯洛文尼亚",
	"SB": "所罗门群岛",
	"SO": "索马里",
	"ZA": "南非",
	"SS": "南苏丹",
	"ES": "西班牙",
	"LK": "斯里兰卡",
	"SD": "苏丹",
	"SR": "苏里南",
	"SZ": "斯威士兰",
	"SE": "瑞典",
	"CH": "瑞士",
	"SY": "叙利亚",
	"TJ": "塔吉克斯坦",
	"TZ": "坦桑尼亚",
	"TH": "泰国",
	"TL": "东帝汶",
	"TG": "多哥",
	"TK": "托克劳",
	"TO": "汤加",
	"TT": "特立尼达和多巴哥",
	"TN": "突尼斯",
	"TR": "土耳其",
	"TM": "土库曼斯坦",
	"TC": "特克斯和凯科斯群岛(英国)",
	"TV": "图瓦卢",
	"UG": "乌干达",
	"UA": "乌克兰",
	"AE": "阿拉伯联合酋长国",
	"GB": "英国",
	"UY": "乌拉圭",
	"UZ": "乌兹别克斯坦",
	"VU": "瓦努阿图",
	"VE": "委内瑞拉",
	"VN": "越南",
	"WF": "瓦利斯和富图纳群岛(法国)",
	"YE": "也门",
	"ZM": "赞比亚"
};
var all_down_sum = 0;
var run = false;
var visibl = true;
var thread_down = [];
var lsat_all_down = 0;
var refresh_lay = 5000;
var now_speed = 0;
var now_global_ping = 0;

/*
多线程下载
*/
async function start_thread(index) {
	const controller = new AbortController();
	const signal = controller.signal;

	try {
		const response = await fetch(testurl, {
			cache: "no-store",
			mode: 'cors',
			referrerPolicy: 'no-referrer',
			signal: signal
		});
		const reader = response.body.getReader();
		while (true) {
			const {
				value,
				done
			} = await reader.read();
			if (done) {
				reader.cancel();
				start_thread(index);
				break;
			}
			if (!run) {
				reader.cancel();
				controller.abort();
				break;
			}
			thread_down[index] += value.length;
		}
	} catch (err) {
		console.log(err);
		if (run) start_thread(index);
	}
}


/*
计算速率和宽度
*/


let currentUnit = "B/s";




function show(num, des, flo) {
	let cnum = num;
	let total_index = 0;
	while (cnum >= 1024 && total_index < des.length - 1) {
		cnum /= 1024;
		total_index++;
	}
	return cnum.toFixed(flo[total_index]) + des[total_index];
}



async function cale() {
	const all_down_a = sum(thread_down);
	const current_time = new Date()
		.getTime();
	const time_diff = current_time - lsat_date;

	now_speed = (all_down_a - lsat_all_down) / time_diff * 1000 / 1024 / 1024; // 更新当前速度


	// 根据当前速度确定新的单位
	const speedUnits = ['B/s', 'KB/s', 'MB/s', 'GB/s', 'TB/s', 'PB/s'];
	let newUnit = currentUnit;
	let speedIndex = 0;

	if (now_speed > 0) {
		speedIndex = Math.floor(Math.log(now_speed * 1024 * 1024) / Math.log(1024));
		speedIndex = Math.max(0, Math.min(speedIndex, speedUnits.length - 1)); // 确保索引在有效范围内
		newUnit = speedUnits[speedIndex];
	}


	if (visibl) {
		document.getElementById("speed")
			.innerText = show((all_down_a - lsat_all_down) / time_diff * 1000, ['B/s', 'KB/s', 'MB/s', 'GB/s', 'TB/s', 'PB/s'], [0, 0, 1, 2, 2, 2]);
		document.getElementById("mbps")
			.innerText = show((all_down_a - lsat_all_down) / time_diff * 8000, ['Bps', 'Kbps', 'Mbps', 'Gbps', 'Tbps', 'Pbps'], [0, 0, 0, 2, 2, 2]);
	} else {
		document.title = show((all_down_sum + all_down_a), ['B', 'KB', 'MB', 'GB', 'TB', 'PB'], [0, 0, 0, 2, 2, 2]) + ' ' + show((all_down_a - lsat_all_down) / time_diff * 1000, ['B/s', 'KB/s', 'MB/s', 'GB/s', 'TB/s', 'PB/s'], [0, 0, 0, 2, 2, 2]);
	}

	// 更新currentUnit为新的单位
	currentUnit = newUnit;

	lsat_all_down = all_down_a;
	lsat_date = current_time;

	if (run) {
		setTimeout(cale, 1000);
	} else {
		const avg_speed = 1000 * all_down_a / (current_time - start_time);
		now_speed = 0; // 运行结束时清零当前速度
		document.getElementById("speed")
			.innerText = show(avg_speed, ['B/s', 'KB/s', 'MB/s', 'GB/s', 'TB/s', 'PB/s'], [0, 0, 1, 2, 2, 2]);
		document.getElementById("mbps")
			.innerText = show(avg_speed * 8, ['Bps', 'Kbps', 'Mbps', 'Gbps', 'Tbps', 'Pbps'], [0, 0, 0, 2, 2, 2]);
		lsat_all_down = 0;
		document.getElementById('describe')
			.innerText = '平均速率';
	}
}

async function total() {
	const all_down = sum(thread_down);
	if (visibl) {
		document.getElementById("total")
			.innerText = show(all_down_sum + all_down, ['B', 'KB', 'MB', 'GB', 'TB', 'PB'], [0, 0, 1, 2, 2, 2]);
	}
	if (all_down_sum + all_down >= Maximum && Maximum != 0) {
		stop();
	}
	if (run) {
		setTimeout(total, 100);
	} else {
		all_down_sum += all_down;
		document.getElementById("total")
			.innerText = show(all_down_sum, ['B', 'KB', 'MB', 'GB', 'TB', 'PB'], [0, 0, 1, 2, 2, 2]);
	}
}

/*
计算流量
*/
async function total() {
	const all_down = sum(thread_down);
	const total_data = all_down_sum + all_down;

	if (visibl) {
		document.getElementById("total")
			.innerText = show(total_data, ['B', 'KB', 'MB', 'GB', 'TB', 'PB'], [0, 0, 1, 2, 2, 2]);
	}

	if (total_data >= Maximum && Maximum !== 0) {
		stop();
		return; // 避免继续运行
	}

	if (run) {
		requestAnimationFrame(total); // 使用 requestAnimationFrame 替代 setTimeout
	} else {
		all_down_sum += all_down;
		document.getElementById("total")
			.innerText = show(all_down_sum, ['B', 'KB', 'MB', 'GB', 'TB', 'PB'], [0, 0, 1, 2, 2, 2]);
	}
}

async function start() {
	if (all_down_sum >= Maximum && Maximum != 0) {
		all_down_sum = 0;
	}
	maxtheard = document.getElementById("thread")
		.value;
	testurl = document.getElementById("link")
		.value;
	if (testurl.length < 10) {
		layer.msg('链接不合法', {
			icon: 7
		});
		return;
	}
	testurl = testurl.substring(0, 5)
		.toLowerCase() + testurl.substring(5, testurl.length);
	if (!checkURL(testurl)) {
		layer.msg('链接不合法', {
			icon: 7
		});
		return;
	}
	if (testurl.startsWith("http://")) {
		layer.msg('由于浏览器安全限制，不支持http协议，请使用https协议', {
			icon: 7
		});

		return;
	}
	if (!testurl.startsWith("https://")) {
		layer.msg('链接不合法', {
			icon: 7
		});
		return;
	}
	document.getElementById('do')
		.innerText = '正在连接测速点...';
	document.getElementById('do')
		.disabled = true;

	try {
		const response = await fetch(testurl, {
			cache: "no-store",
			mode: 'cors',
			referrerPolicy: 'no-referrer'
		});
		const reader = response.body.getReader();
		const {
			value,
			done
		} = await reader.read();
		if (value.length <= 0) throw "资源响应异常";
		reader.cancel();
	} catch (err) {
		console.warn(err);
		document.getElementById('do')
			.innerText = '开始测速';
		document.getElementById('do')
			.disabled = false;
		document.getElementById('do')
			.classList.remove('layui-border-red');
		layer.msg('该链接不可用，如果你能够正常访问该链接，那么很有可能是浏览器的跨域限制', {
			icon: 7
		});
		return;
	}
	document.getElementById('describe')
		.innerText = '速率';
	const doButton = document.getElementById('do');
	doButton.innerText = '停止测速';
	doButton.disabled = false;
	doButton.classList.add('layui-bg-red');
	var num = maxtheard;
	lsat_all_down = 0;
	start_time = new Date()
		.getTime();
	run = true;
	thread_down = [];
	while (num--) {
		thread_down[num] = 0;
		start_thread(num);
	}
	cale();
	total();
}

function stop() {
	run = false;
	const doButton = document.getElementById('do');
	doButton.innerText = '开始测速';
	doButton.classList.remove('layui-bg-red');
}

function sum(arr) {
	var s = 0;
	for (var i = 0; i < arr.length; i++) {
		s += arr[i];
	}
	return s;
}

function botton_clicked() {
	if (run) {
		stop();
	} else {
		start();
	}
}

function checkURL(URL) {
	var str = URL;
	var Expression = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
	var objExp = new RegExp(Expression);
	if (objExp.test(str) == true) {
		return true;
	} else {
		return false;
	}
}

var cnip = '';

function ipcn() {
	if (visibl) {
		fetch('https://forge.speedtest.cn/api/location/info', {
				referrerPolicy: 'no-referrer'
			})
			.then(response => response.json())
			.then(data => {
				var tag = document.getElementById("ipcn");
				tag.innerText = data['ip'] + ' ' + data['province'] + ' ' + data['isp'];
				if (data['ip'] !== cnip) {
					tag.style.color = '';
					(data['ip'], tag);
				}
				cnip = data['ip'];
			});
	}
	setTimeout(ipcn, 5000);
}

var gbip = '';

function ipgb() {
	if (visibl) {
		fetch('https://api-ipv4.ip.sb/geoip', {
				referrerPolicy: 'no-referrer'
			})
			.then(response => response.json())
			.then(data => {
				var tag = document.getElementById("ipgb");
				tag.innerText = data['ip'] + ' ' + CountryCode_Zh_cn[data['country_code']] + ' ' + data['isp'];
				if (data['ip'] !== gbip) {
					tag.style.color = '';
				}
				gbip = data['ip'];
				document.getElementById("listItem")
					.style.display = "block"; // 获取到数据时显示 <li> 元素
			})
			.catch(error => {
				document.getElementById("listItem")
					.style.display = "none"; // 获取不到数据时隐藏 <li> 元素
			});
	}
	setTimeout(ipgb, refresh_lay);
}

function laycn() {
	if (visibl) {
		var start_ti = new Date()
			.getTime();
		fetch("https://connectivitycheck.platform.hicloud.com/generate_204", {
				method: "HEAD",
				cache: "no-store",
				mode: 'no-cors',
				referrerPolicy: 'no-referrer'
			})
			.then(function() {
				var lay = new Date()
					.getTime() - start_ti;
				document.getElementById("laycn")
					.innerText = lay + 'ms';
			})
			.catch(error => document.getElementById("laycn")
				.innerText = '-ms');
	}
	setTimeout(laycn, 1000);
}

function laygb() {
	if (visibl) {
		var start_ti = new Date()
			.getTime();
		fetch("https://cp.cloudflare.com/", {
				method: "HEAD",
				cache: "no-store",
				mode: 'no-cors',
				referrerPolicy: 'no-referrer'
			})
			.then(function() {
				var lay = new Date()
					.getTime() - start_ti;
				document.getElementById("laygb")
					.innerText = lay + 'ms';
			})
			.catch(error => document.getElementById("laygb")
				.innerText = '-ms');
	}
	setTimeout(laygb, 1000);
}

function ckbl() {
	if (visibl) {
		const controller = new AbortController();
		setTimeout(() => controller.abort(), 2000);
		fetch("https://twitter.com/", {
				signal: controller.signal,
				method: "HEAD",
				cache: "no-store",
				mode: 'no-cors',
				referrerPolicy: 'no-referrer'
			})
			.then(function() {
				document.getElementById("laygb")
					.style.color = "green";
			})
			.catch(error => document.getElementById("laygb")
				.style.color = "red");
	}
	setTimeout(ckbl, 1000);
}

ipcn();
ipgb();
laycn();
laygb();
ckbl();

/*
设置流量上限
*/
var Maximum = 0
setMax(getCookie('Max'))

function setMax(inputMax) {
	if (inputMax > 0) {
		Maximum = inputMax * 1073741824;
		document.getElementById("showMax")
			.value = '' + show(Maximum, ['B', 'KB', 'MB', 'GB', 'TB', 'PB'], [0, 0, 1, 2, 2, 2]);
	} else {
		Maximum = 0;
		document.getElementById("showMax")
			.value = '';
	}
}