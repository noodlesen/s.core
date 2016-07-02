function renderMessage(owner, m){
    var dir='';
    console.log('user from: '+m.user_from);
    console.log('owner: '+owner);
    shift='';
    if (m.sender==owner){
        dir='msg__from-me';
        shift='col-lg-offset-3'
    }
    else{
        dir='msg__to-me';
    }
    return ('<div class="row '+dir+'"><div class="col-lg-9 '+shift+' msg__bubble">'+m.text+'</div></div>');
}


$(document).ready(function(){
    var currentUser = $('meta[name=uid]').attr('content');

    /*$('#chat').append(renderMessage('msg__to-me', {text:'Hello world!'}));*/

    var selectedUser=null;

    $('#msg__send-button').on('click', function(){
        var txt = $('#msg__textarea').val();
        var id = selectedUser.attr('data-uid');
        if (selectedUser && txt!=''){
            getResults('/post-messenger', 'json', {text: txt, cmd:'sendMessage', uid: id}, function(res){
                if (res.status=='ok'){
                    $('#msg__textarea').val('');
                    $('#chat').append(renderMessage(currentUser, {text:txt, sender:currentUser}));
                }
                
            });
        }
    });

    $('li.contact-list__item').on('click', function(){
        $(this).addClass('contact-list__item--selected');
        if(selectedUser){
            selectedUser.removeClass('contact-list__item--selected');
        }
        selectedUser=$(this);
        $('#chat__header').html('Ваш чат с пользователем '+$(this).html());
        $('#chat').html('');
        getResults('/post-messenger', 'json', {cmd:'getMessages', uid: $(this).attr('data-uid')}, function(res){
            var msgs = res.messages;
            for (i=0; i<msgs.length; i++){
                $('#chat').append(renderMessage(currentUser,msgs[i]));
                $('#msg__send-button').prop('disabled', false);
            }
        });
    }); 



});