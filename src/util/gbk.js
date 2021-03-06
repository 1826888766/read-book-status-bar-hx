/* eslint-disable eqeqeq */
/*  GBKUrl.js , version 0.0.1
 *  (c) 2011 meichua.com
 */
var GBKTable = require("./font.js").GBKTable;
class WxApi  {

	encodeURI(str) {
		if(str != null) {
			var result = "";
			for(var i=0;i<str.length;i++) {
				var d = str.charCodeAt(i);
				if(d >= 0x20 && d <= 0x7F) {
					if( d==0x20 || d==0x22|| d==0x25|| d==0x3C|| d==0x3E || (d>=0x5B && d<=0x5E) || d==0x60|| (d>=0x7B && d<=0x7D)|| d==0x7F ) {
						result += this.number2str(d);
					}  else {
						result += str.charAt(i);                
					}
				} else {
					result += this.number2str(d);
				}
			}
			return result;     
		} else {
			return "";
		}
    }
    
	encodeURIComponent(str) {
		if(str != null) {
			var result = "";
			for(var i=0;i<str.length;i++) {
				var d = str.charCodeAt(i);
				if(d >= 0x20 && d <= 0x7F) {
					if( d==0x20 || (d>=0x22 && d<=0x26) || d==0x2B || d==0x2C|| d==0x2F|| (d>=0x3A && d<=0x3F) || d==0x40|| (d>=0x5B && d<=0x5E) || d==0x60|| (d>=0x7B && d<=0x7D) || d==0x7F ) {
						result += this.number2str(d);
					} else {
						result += str.charAt(i);                
					}
				} else {
					result += this.number2str(d);
				}
			}
			return result;
		} else {
			return "";
		}
    }
    
	number2str(d) {
		var value = GBKTable[d];
		if(value != null) {
			if(value.length == 2) {
				return "%" + value;
			} else {
				return "%" + value.substring(0,2) + "%" + value.substring(2,4);
			}
		} else {
			return "%u"+d.toString(16).toUpperCase();
		}
	}
}

module.exports ={
	"WxApi": new WxApi()
}
