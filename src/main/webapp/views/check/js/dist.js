$(function(){var N=findUserPower();});function findUserPower(){var powerN=0;$.ajax({async:false,url: WEB_ROOT+'/olo/subject!doLoginUser.do',type: "POST",success: function(data) {powerN=data;}});if(powerN=="0"){window.location.href =WEB_ROOT+"/views/users/login.jsp";};if(powerN=="1"){window.location.href =WEB_ROOT+"/views/check/check.jsp";};if(powerN=="2"){window.location.href =WEB_ROOT+"/views/check/configCheck.jsp";};return powerN;}