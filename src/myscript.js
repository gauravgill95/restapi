 $(document).ready(function(){  
      var i=1;  
      var limit=10;
      $('#add').click(function(){  
           i++;
           if(i<limit)  
           $('#dynamic_field').append('<tr id="row'+i+'"><td><input type="text" name="name" placeholder="Enter your item" class="form-control name_list" /></td><td><select id="Category" name="Category"><option value="Animals">Animals</option><option value="Flowers">Flowers</option><option value="Fruits">Fruits</option></select></td><td><button type="button" name="remove" id="'+i+'" class="btn btn-danger btn_remove">X</button></td></tr>');  
      });  
      $(document).on('click', '.btn_remove', function(){  
           var button_id = $(this).attr("id");   
           $('#row'+button_id+'').remove();  
      });  
      $("#submit").click(function(){
        $("#add_name").submit();
      })
      /*
      $('#submit').click(function(){            
           $.ajax({  
                url:"name.php",  
                method:"POST",  
                data:$('#add_name').serialize(),  
                success:function(data)  
                {  
                     alert(data);  
                     $('#add_name')[0].reset();  
                }  
           });  
      });
      */  
 });  