$(function(){
/* Appending/etc */
//add the image, details, tags, copy, and delete links
// add link.... add tags, add comments, add ???
var dragdropimg = "<span class='ui-icon ui-icon-border ui-icon-dragdrop'></span>",
 detailslink = " <div><div class='clearfix'></div><span class='ui-icon ui-icon-border ui-icon-details detailslink'></span><a class='detailslink' href='#'>details</a></div>",
 cprmlinks = " <a class='copy' href='#'>copy</a> <a class='delete' href='#'>delete</a>",
 tgcmdiv = "<div class='tgcmdiv'><a class='tag' href='#'>tags</a> <a class='comment' href='#'>comment</a></div>";
$('#types li.item').each(function(){
  $(this).prepend(dragdropimg);
});
$('#types li:not(.detailed)').each(function(){
  $(this).append(cprmlinks);
});
$('#types .details').each(function(){
  $(this).before(detailslink+cprmlinks).append(tgcmdiv);
});
$('#list_info .details').append(tgcmdiv);
$('.movetoend').appendTo($('.movetoend').parent());
//ratings
var ratings = 
"<option value='1'>1</option>" +
"<option value='2'>2</option>" +
"<option value='3'>3</option>" +
"<option value='4'>4</option>" +
"<option value='5'>5</option>" +
"<option value='6'>6</option>" +
"<option value='7'>7</option>" +
"<option value='8'>8</option>" +
"<option value='9'>9</option>" +
"<option value='10'>10</option>";
$('.rating').append(ratings);

//show details - TODO test once on couchdb server
if($.cookie('show_details') === 'true'){
  $('.details').removeClass('hide');
}

/* Click Events */
//always show details cookie - TODO test once on couchdb server
$('#show_details').click(function(){
  if($(this).attr('checked') === true){
    $.cookie('show_details','true');
    $('.details').sdr();
  }
});
//show/hide all details
$('.show_hide_details').toggle(function(){
  $(this).html('hide all details');
  $('.details:not(#list_info .details,#types .details)').sdr();
},function(){
  $(this).html('show all details');
  $('.details:not(#list_info .details,#types .details)').sua();
});

//tags and comments
function tagCommentClick(selector, type, typed){
$(selector).click(function(){
  var p = $(this).parent(), o = p.find(type);
  if(o.length === 0){
    $(typed).children().clone(true).addClass('hide')
      .appendTo(p).sdr();
      resizer(p);
  }else if (existsAndHidden(o)){
    o.sdr();
  }else{
    o.sua();
  }
  return false;
});
}
function existsAndHidden(o){
  return (o.length === 1 && o.hasClass('hide'));
}
tagCommentClick('.tag','.tags','#tagged');
tagCommentClick('.comment','.comments','#commented');
//toggles for details section (books/movies/etc)
$('.detailslink').click(function(){
  var details = $(this).parents('.item').find('.details');
  if(details.hasClass('hide')){
    details.sdr();
  }else{
    details.sua();
  }
  return false;
});
//reveal next/end when when checkbox checked
$('.revealnext').click(function(){
  if($(this).attr('checked') === true){
    $(this).next().sdr();
  }else{
    $(this).next().sua().children().val('');
  }
});
$('.revealend').click(function(){
  if($(this).attr('checked') === true){
    $(this).parent().find('.movetoend').sdr();
  }else{
    $(this).parent().find('.movetoend').sua().children().val('');
  }
});
//add button click events for which to clone
$('.addButton').click(function(){
  var selected=$(this).parent().find('select option:selected').val(), toAdd;
  switch(parseInt(selected)){
    case 1:toAdd=$('#tt').clone(true);break;
    case 2:toAdd=$('#tat').clone(true);break;
    case 3:toAdd=$('#ttat').clone(true);break;
    case 4:toAdd=$('#tdt').clone(true);break;
    case 5:toAdd=$('#tadt').clone(true);break;
    case 6:toAdd=$('#ttadt').clone(true);break;
    case 11:toAdd=$('#todo').clone(true);break;
    case 12:toAdd=$('#bk').clone(true);break;
    case 13:toAdd=$('#mv').clone(true);break;
    case 14:toAdd=$('#tv').clone(true);break;
    case 15:toAdd=$('#tvi').clone(true);break;
    case 16:toAdd=$('#per').clone(true);break;
    case 17:toAdd=$('#mg').clone(true);break;
    case 18:toAdd=$('#co').clone(true);break;
    case 19:toAdd=$('#tt').clone(true);break;
    case 20:toAdd=$('#cd').clone(true);break;
    case 21:toAdd=$('#qa').clone(true);break;
    case 22:toAdd=$('#re').clone(true);break;
    case 23:toAdd=$('#op').clone(true);break;
    case 24:toAdd=$('#so').clone(true);break;
    default:toAdd=$('#tt').clone(true);
  }
  toAdd.addHideNoIds().val('').end().appendTo('#items').fadeDate();
  resizer(toAdd);

  if(addSaveAddBar()){
    $('#items li:first').remove();
    var selects = $('.saveAddBar select :selected').val();
    $('.saveAddBar').clone(true).find('select').val(selects).end()
      .insertAfter($('#items'));
  }
  function addSaveAddBar(){
    return ($('#items li').length > 1 && $('.saveAddBar').length === 1);
  }
});
//copy click events
$('.copy').click(function(){
  var parent = $(this).parent(), selects = [];
  parent.find('select :selected').each(function(i){
    selects[i] = $(this).val();
  }).end()
  //hack fix due to jquery bug not cloning textarea value in FF
  .find('textarea').each(function(){
    $(this).text($(this).val());
  });
  var clone = parent.clone(true).css({'display':''}).addHideNoIds().end()
    .find('select').each(function(i){
      $(this).val(selects[i]);
    }).end();
  resizer(clone);
  clone.insertAfter(parent).fadeDate();
  return false;
});
//addone click events
$('.addone').click(function(){
  var next = $(this).next(), klass = next.attr('class');
  $('#types .' + klass).children('li:first').clone(true).addHideNoIds().val('').end()
    .appendTo(next).fadeDate();
  return false;
});
//delete click events
$('.delete').click(function(){
  var parent = $(this).parent(), clone = $("#deleteitem").clone(), 
  opts = {autoOpen:false,draggable:false,minHeight:70,modal:true,resizable:false,dialogClass:"dialog-error",
    buttons:{"Delete":function(){
      parent.fadeOut(function(){
        $(this).remove();
        if($('#items li').length === 0 ){
          $('#items').append("<li class='item'>You don't have any items on your list yet... why don't you add one? :)</li>");
          $('.saveAddBar:odd').remove();
        }
      });
      clone.dialog('close');
    },"Oops! No thanks!":function(){clone.dialog('close');}}
  };
  clone.dialog(opts);
  clone.dialog('open');
  return false;
});

/* focus/blur events */
// add keywords
var tagWords = "Comma separated tags: NY, New York";
$('div.tags input.text').val(tagWords).focus(function(){
  if ($(this).val() === tagWords){
    this.value = "";
  }
}).blur(function(){
  if ($(this).val() === ''){
    this.value = tagWords;
  }
});

/* change events */
//update both itemOption if one is changed
$('select.itemOptions').change(function(){
  $('select.itemOptions').val($(this).val());
});

//sortable
$('#items').sortable({'axis':'y','cursor':'pointer','handle':'.ui-icon-dragdrop'});

//star ratings
//$('.rating').rating({maxvalue:5, increment:.5});
//$("#stars-wrapper").stars({inputType: "select"});

//text resizer
function resizer(self){
  $(self).find('.hasAutoresize').each(function(){
    if ($(this).attr('tabindex') == -1){
      $(this).remove();
    }else{
      $(this).removeClass('hasAutoresize');
    }
  }).end()
    .find('textarea.tall-6').autoResize({minHeight:110}).end()
    .find('textarea.tall-5').autoResize({minHeight:90}).end()
    .find('textarea.tall-4').autoResize({minHeight:70}).end()
    .find('textarea.tall-light-7').autoResize({minHeight:35});
}

//additional functions
$.fn.fadeDate = function(){
  return $(this).fadeIn().removeClass('hide').find('.hasDatepicker').removeAttr('id')
    .removeClass('hasDatepicker').end().find('.datepicker').datepicker();
}
$.fn.addHideNoIds = function(){
  return $(this).addClass('hide').removeAttr('id').children().removeAttr('id');
}
$.fn.sdr = function(){
  return $(this).slideDown().removeClass('hide');
}
$.fn.sua = function(){
  return $(this).slideUp().addClass('hide');
}

});
//TODO: option/cookie to auto expand details on selection
//TODO: add stars for ratings
//TODO: CSS for length of 'labels'/lining up textboxes (on to-do's)
//TODO: select text even while sortable
//TODO: add couchdb!!!
//TODO: add ajax to get ISBN info/etc from amazon
//TODO: add ajax to get season list from amazon/imdb
//TODO: export list as JSON
