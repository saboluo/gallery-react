require('normalize.css/normalize.css');
require('styles/App.scss');
import React from 'react';
import ReactDOM from 'react-dom';
//获取图片数据组
import imagesData from '../data/imagesData.json';
let Com=React.Component;
//将图片数据组中的图片数据添加图片路径
imagesData.forEach(function(val){
	val.imageURL = require('../images/'+val.fileName);
});

//产生图片随机位置函数
function getRandomPos(low,height){
	return Math.floor(Math.random() * (height - low) + low);
}
function get30Deg(){
	return (Math.random() > 0.5 ? '' : '-' ) + Math.ceil(Math.random() * 30);
}
//控制单元组件
class ControllerUnit extends Com{
	constructor(props){
		super(props);
		this.onclickHandle = this.onclickHandle.bind(this);
	}
	onclickHandle(e){
		if(this.props.arrange.isCenter){
			this.props.inverse();
		}else{
			this.props.center();
		}
		e.stopPropagation();
		e.preventDefault();
	}
	render(){
		let controllerUnitClassName = "controllerUnit";
		if(this.props.arrange.isCenter){
			controllerUnitClassName += " iscenter";
			this.props.arrange.isInverse ? (controllerUnitClassName += " isinverse") : "";
		}
		return (<span className={controllerUnitClassName} onClick = {this.onclickHandle}></span>);
	}
}

//图片组件
class ImgFigure extends Com{
	constructor(props){
		super(props);
		this.clickHandle=this.clickHandle.bind(this);
	}
	clickHandle(e){
		if(this.props.arrange.isCenter){
			this.props.inverse();
		}else{
			this.props.center();
		}
		e.stopPropagation();
		e.preventDefault();
	}
	render(){
		let styleObj={};
		let figureClassName="image-figure";
		if(this.props.arrange.pos){
			styleObj=this.props.arrange.pos;
		}
		if(this.props.arrange.rotate){
			["WebkitTransform","MozTransform","MsTransform","transform"].forEach((val)=>{
				styleObj[val] = "rotate(" + this.props.arrange.rotate + "deg)";
			});
		}
		if(this.props.arrange.isInverse){
			figureClassName += " is-inverse";
		}
		if(this.props.arrange.isCenter){
			styleObj['zIndex']=11;
		}
		return (
			<figure className={figureClassName} style={styleObj} onClick={this.clickHandle} >
				<img src={this.props.data.imageURL} alt={this.props.data.title}/>
				<figcaption>
					<h2 className="image-title">{this.props.data.title}</h2>
				</figcaption>
				<p className="image-back" onClick={this.clickHandle}>{this.props.data.desc}</p>
			</figure>
		);
	}
}
//主组件
class GalleryApp extends Com{
	//三个区域图片位置分布限制范围
	constructor(props){
			super(props);
			this.Constant={
				CenterPos:{
					left:0,
					top:0
				},
				hPos:{
					leftSec:[0,0],
					rightSec:[0,0],
					y:[0,0]
				},
				vPos:{
					x:[0,0],
					topY:[0,0]
				}
			};
			this.state={
				imgsInfo:[
/*					{
						pos:{left,top},
						rotate:30,
						isInverse:false,
						isCenter
					}*/
				]
			}
	}
	//旋转图片函数
	Inverse(index){
		return () => {
			let imgsInfo = this.state.imgsInfo;
			imgsInfo[index].isInverse =  !imgsInfo[index].isInverse;
			this.setState({
				imgsInfo:imgsInfo
			});
		};
	}
	Center(index){
		return () => {
			this.rerange(index);
		}
	}
	rerange(centerIndex){
		var Constant = this.Constant,
			imgsInfo = this.state.imgsInfo,
			centerPos= Constant.CenterPos,
			hPosLeftSec = Constant.hPos.leftSec,
			hPosRightSec = Constant.hPos.rightSec,
			hPosY = Constant.hPos.y,
			vPosX = Constant.vPos.x,
			vPosY = Constant.vPos.topY;
		//获取中心图片并产生位置
		var centerImg = imgsInfo.splice(centerIndex,1);
			centerImg[0] = {
				pos:centerPos,
				rotate:0,
				isCenter:true,
				isInverse:false
			};
		//随机产生上侧区域的图片，若随机成功，获取并产生位置
		var hasTop = Math.floor(Math.random() * 2),
			topNum = Math.floor(Math.random() * (imgsInfo.length - hasTop)),
			topImg = imgsInfo.splice(topNum,hasTop);
			topImg.forEach(function(val,index){
				topImg[index] = {
					pos:{
					top:getRandomPos(vPosY[0],vPosY[1]),
					left:getRandomPos(vPosX[0],vPosX[1])
					},
					rotate:get30Deg(),
					isCenter:false,
					isInverse:false
				};
			});
		//位左右两侧的图片进行布局
		for(let i = 0 , j = imgsInfo.length , k = j / 2;i < j; i++){
			var posHR;
			if(i<k){
				posHR = hPosLeftSec;
			}else{
				posHR = hPosRightSec;
			}
			imgsInfo[i] = {
				pos:{
					top:getRandomPos(hPosY[0],hPosY[1]),
					left:getRandomPos(posHR[0],posHR[1])
				},
				rotate:get30Deg(),
				isCenter:false,
				isInverse:false
			};
		}
		if(topImg && topImg[0]){
			imgsInfo.splice(topNum,0,topImg[0]);
		};
		imgsInfo.splice(centerIndex,0,centerImg[0]);
		this.setState({
			imgsInfo:imgsInfo
		});
	}
	componentDidMount(){
		//获取舞台宽度和高度
		var stageDOM = ReactDOM.findDOMNode(this.refs.stage),
			stageW = stageDOM.scrollWidth,
			stageH = stageDOM.scrollHeight,
			halfstageW = Math.ceil(stageW / 2),
			halfstageH = Math.ceil(stageH / 2);
		//获取图片宽度和高度
		var imgFigDOM = ReactDOM.findDOMNode(this.refs.fig0),
			imgW = imgFigDOM.scrollWidth,
			imgH = imgFigDOM.scrollHeight,
			halfimgW = Math.ceil(imgW / 2),
			halfimgH = Math.ceil(imgH / 2);

		//计算中心区域图片位置
		this.Constant.CenterPos={
				left:halfstageW - halfimgW,
				top:halfstageH - halfimgH
		};
		this.Constant.hPos.leftSec[0] = -halfimgW;
		this.Constant.hPos.leftSec[1] = halfstageW - halfimgW * 3;//左侧水平区域范围
		
		this.Constant.hPos.rightSec[0] = halfstageW + halfimgW;
		this.Constant.hPos.rightSec[1] = stageW - halfimgW;//右侧水平区域范围
		
		this.Constant.hPos.y[0] = -halfimgH;
		this.Constant.hPos.y[1] = stageH - halfimgH;//左右侧区域垂直方向区域范围
		
		this.Constant.vPos.x[0] = halfstageW - imgW;
		this.Constant.vPos.x[1] = halfstageW;//上侧区域水平方向范围
		
		this.Constant.vPos.topY[0] = -halfimgH;
		this.Constant.vPos.topY[1] = halfstageH - halfimgH * 3;//上侧区域垂直方向范围
		
		this.rerange(0);
	}
	render(){
		//制造图片组件，并绑定数据
		var controllerUnits = [],
			ImgFigures = [];
		imagesData.forEach(function(value,index){
			if(!this.state.imgsInfo[index]){//初始化图片位置状态
				this.state.imgsInfo[index]={
					pos:{
						left:0,
						top:0
					},
					rotate:0,
					isInverse:false,
					isCenter:false
				};
			}
			//图片标签组
			ImgFigures.push(<ImgFigure data={value} 
									   key = {index}
									   ref = {'fig'+index}
									   arrange={this.state.imgsInfo[index]}
									   inverse={this.Inverse(index)}
									   center={this.Center(index)}
							/>);
			//控制单元标签组
			controllerUnits.push(<ControllerUnit 
										key = {index}
										arrange={this.state.imgsInfo[index]}
									    inverse={this.Inverse(index)}
									    center={this.Center(index)}
								/>);
		}.bind(this));
		return (
			<section className="stage" ref="stage">
				<section className="image-sec">
					{ImgFigures}
				</section>
				<nav className="controller-sec">
					{controllerUnits}
				</nav>
			</section>
		);
	}
}

export default GalleryApp;
