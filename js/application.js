$(function(){
/* Appending/etc */
//add the image, details, tags, copy, and remove links
var dragdropimg = "<span class='ui-icon ui-icon-arrowthick-2-n-s'></span>";
var detailslink = " <a class='detailslink' href='#'>details</a>";
var cprmlinks = " <a class='copy' href='#'>copy</a> <a class='remove' href='#'>remove</a>";
var taglink = " <a class='tag' href='#'>tags</a>";
$('#types li.bordered').each(function(){
  $(this).prepend(dragdropimg);
});
$('#types li:not(.detailed)').each(function(){
  $(this).append(cprmlinks);
});
$('#types .details').each(function(){
  $(this).before(detailslink).before(taglink).before(cprmlinks);
});
$('#listInfo .details').before(detailslink).before(taglink);
//show details - TODO test once on couchdb server
if($.cookie('show_details') === 'true'){
  $('.details').removeClass('hide');
}

/* Click Events */
//always show details cookie - TODO test once on couchdb server
$('#showDetails').click(function(){
  if($(this).attr('checked') === true){
    $.cookie('show_details','true');
    $('.details').sdr();
  }
});
//show/hide details
$('#showHideDetails').toggle(function(){
  $(this).html('hide all details');
  $('.details:not(#listInfo .details)').sdr();
},function(){
  $(this).html('show all details');
  $('.details:not(#listInfo .details)').sua();
});

//tag toggle (move to details?)
$('.tag').click(function(){
  var parent = $(this).parent(), tags = parent.find('.tags');
  if(tags.length === 0){
    $('#tagged').children().clone(true).addClass('hide')
      .insertBefore(parent.find('.details'))
      .sdr();
  }else if (exists(tags)){
    tags.sdr();
  }else{
    tags.sua();
  }
  return false;
  function exists(o){
    return (o.length === 1 && o.hasClass('hide'));
  }
});
//toggles for details section (books/movies/etc)
$('.detailslink').click(function(){
  var details = $(this).parent().find('.details');
  if(details.hasClass('hide')){
    details.sdr();
  }else{
    details.sua();
  }
  return false;
});
//reveal next when when checkbox checked
$('.revealnext').click(function(){
  if($(this).attr('checked') === true){
    $(this).next().sdr();
  }else{
    $(this).next().sua().children().val('');
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
    default:toAdd=$('#tt').clone(true);
  }
  toAdd.addHideNoIds().val('').end().appendTo('#items').fadeDate();
  resizer(toAdd);

  if(addSaveAddBar()){
    $('#items li:first').html('');
    var selects = $('.saveAddBar select :selected').val();
    $('.saveAddBar').clone(true).find('select').val(selects).end()
      .insertBefore($('#items'));
  }
  function addSaveAddBar(){
    return ($('#items li').length > 1 && $('.saveAddBar').length === 1);
  }
});
//copy click events
$('.copy').click(function(){
  var parent = $(this).parent(), selects = [];
  //hack fix due to jquery not cloning select values
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
  $('#types .' + klass).find('li:first').clone(true).addHideNoIds().val('').end()
    .insertAfter(next.find('li:last')).fadeDate();
  return false;
});
//remove click events
$('.remove').click(function(){
  var parent = $(this).parent(), clone = $("#removeitem").clone(), 
  opts = {autoOpen:false,resizable:false,draggable:false,minHeight:70,modal:true,
    buttons:{"Delete":function(){
      if (parent.parent().find('li').length !== 1){
        parent.fadeOut(function(){
          $(this).remove();
          var li = $('#items li');
          if (removeAddSaveBar(li)){
            li.html('Add an item to your list!');
            $('.saveAddBar:first').remove();
          }
          function removeAddSaveBar(li){
            return (li.length === 1 && $('.saveAddBar').length === 2);
          }
        });
        clone.dialog('close');
      }
      else{
        parent.fadeOut(function(){$(this).html('')});
        clone.dialog('close');
      }
    },"Oops! No thanks!":function(){clone.dialog('close');}}
  };
  clone.dialog(opts);
  clone.dialog('open');
  return false;
});

/* focus/blur events */
// add keywords
var tagWords = "Comma separated tags e.g.: NY, New York";
$('div.tags input.text').val(tagWords).focus(function(){
  if ($(this).val() === tagWords){
    this.value = "";
  }
}).blur(function(){
  if ($(this).val() === ''){
    this.value = tagWords;
  }
});

//make the items sortable and remove the blank row
//$('#items').sortable({axis:'y',cursor:'n-resize'});
//$('#items, #items a').disableSelection();


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
    .find('textarea.tall-4').autoResize({minHeight:70});
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
