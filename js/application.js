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
$('#listName').after(taglink);

/* Click Events */
//tag toggle (move to details?)
$('.tag').click(function(){
  var parent = $(this).parent();
  var tags = parent.find('.tags');
  if(tags.length === 0){
    $('#tagged').children().clone(true).addClass('hide')
      .insertBefore(parent.find('.details'))
      .slideDown().removeClass('hide');
  }else if (exists(tags)){
    tags.slideDown().removeClass('hide');
  }else{
    tags.slideUp().addClass('hide');
  }
  return false;
  function exists(jquery){
    if (jquery.length === 1 && jquery.hasClass('hide'))
      return true;
  }
});
//toggles for details section (books/movies/etc)
$('.detailslink').toggle(function(){
  $(this).parent().find('.details').slideDown().removeClass('hide');
}, function(){
  $(this).parent().find('.details').slideUp().addClass('hide');
});
//reveal next when when checkbox checked
$('.revealnext').click(function(){
  if($(this).attr('checked') === true){
    $(this).next().slideDown().removeClass('hide');
  }else{
    $(this).next().slideUp().addClass('hide');
  }
});
//add button click events for which to clone
$('#addButton').click(function(){
  var selected=$('#addSelect option:selected').val(), toAdd;
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
    case 15:toAdd=$('#per').clone(true);break;
    default:toAdd=$('#tt').clone(true);
  }
  toAdd.addClass('hide').attr('id','').children().attr('id','').end()
    .appendTo('#items').fadeIn().removeClass('hide').find('.hasDatepicker')
    .attr('id','').removeClass('hasDatepicker');
  $('.datepicker').datepicker();
  if($('#items li').length > 1 && $('.saveAddBar').length === 1){
    var selects = $('.saveAddBar select :selected').val();
    $('.saveAddBar').clone(true).find('select').val(selects).end()
      .insertBefore($('#items'));
  }
});
//copy click events
$('.copy').click(function(){
  var parent = $(this).parent(), selects = [];
  //hack fix due to jquery not cloning select values
  parent.find('select :selected').each(function(i){
    selects[i] = $(this).val();
  });
  //hack fix due to jquery bug not cloning textarea value in FF
  parent.find('textarea').each(function(){
    $(this).text($(this).val());
  });
  parent.clone(true).addClass('hide').css({'display':''})
    .removeAttr('id').find('select').each(function(i){
      $(this).val(selects[i]);
    }).end().children().removeAttr('id').end().insertAfter(parent);
  parent.next().fadeIn().removeClass('hide').find('.hasDatepicker')
    .removeAttr('id').removeClass('hasDatepicker');
  $('.datepicker').datepicker();
  return false;
});
//addone click events
$('.addone').click(function(){
  var klass = $(this).next().attr('class');
  $('#types .' + klass).find('li:first').clone(true).addClass('hide').removeAttr('id')
    .children().removeAttr('id').val('').end().insertAfter($(this).next().find('li:last'))
    .fadeIn().removeClass('hide').find('.hasDatepicker').removeAttr('id')
    .removeClass('hasDatepicker');
  $('.datepicker').datepicker();;
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
          if ($('#items li').length === 1 && $('.saveAddBar').length === 2)
            $('.saveAddBar:first').remove();
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
$('div.tags input.text').val("Comma separated tags e.g.: NY, New York").focus(function(){
  if ($(this).val() == "Comma separated tags e.g.: NY, New York"){
    this.value = "";
  }
}).blur(function(){
  if ($(this).val() == ''){
    this.value = "Comma separated tags e.g.: NY, New York";
  }
});

//make the items sortable and remove the blank row
$('#items').sortable({axis:'y',cursor:'n-resize'});
$('#items, #items a').disableSelection();


//star ratings
//$('.rating').rating({maxvalue:5, increment:.5});
//$("#stars-wrapper").stars({inputType: "select"});

//autogrow textareas
//$('textarea').autogrow();
});
//TODO: add stars for ratings
//TODO: CSS for length of 'labels'/lining up textboxes
//TODO: select text even while sortable
//TODO: autogrowing textarea
//TODO: add couchdb!!!
//TODO: add ajax to get ISBN info/etc from amazon
//TODO: add ajax to get season list from amazon/imdb
