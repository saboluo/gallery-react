require('normalize.css/normalize.css');
require('styles/App.scss');
import React from 'react';
//获取图片数据组
import imagesData from '../data/imagesData.json';
//将图片数据组中的图片数据添加图片路径
imagesData.forEach(function(val){
	val.imageURL = require("../images/"+val.fileName);
});

class GalleryApp extends React.Component{
	render(){
		return (
			<section className="stage">
				<section className="image-sec">
				
				</section>
				<nav className="controller-sec">
				
				</nav>
			</section>
		);
	}
}

export default GalleryApp;
