function addChildClassed(parent,newClass,tag='div') {
    var newDiv = document.createElement(tag);

    var classes = newClass.split(' ')
    for (var i=0; i<classes.length; i++) {
        newDiv.classList.add(classes[i]);
    }

    parent.appendChild(newDiv);
    return newDiv;
}

$(function() {

    const clipHolder = document.querySelector('#main-clips')

    d3.json('dev-projects.json')
    .then(data => { 
        console.log(data)
        data = data['clips']
        for (var i=0; i<data.length; i++) {
            var clipData = data[i];
    
            var newClip = addChildClassed(clipHolder,'clip', tag='a')
    
            // var imageCol = addChildClassed(newClip,'clip-image-column')
            // imageCol.classList.add('column')
            var contentCol = addChildClassed(newClip,'dev-content-column')
            contentCol.classList.add('column')
    
            // var clipImage = addChildClassed(imageCol,'clip-image','img')
            // clipImage.setAttribute('src',clipData['image'])
    
            if ('award' in clipData) {
                addChildClassed(contentCol,'clip-award','p').textContent = clipData['award']
            }
            if (clipData['is_git'] == 'true') {
                addChildClassed(contentCol,'clip-title','h2').innerHTML = '<p>' + clipData['title'] + ' <i class="fa-brands fa-github"></i>' + '</p>'
            } else {
                addChildClassed(contentCol,'clip-title','h2').innerHTML = '<p>' + clipData['title'] + '</p>'
            }
            
            addChildClassed(contentCol, 'separator', tag='hr')
            addChildClassed(contentCol, 'tagline', tag='p').textContent = clipData['tagline']
    
            // var metadataElem = addChildClassed(contentCol,'clip-metadata','p')
            // addChildClassed(metadataElem,'clip-date','a').textContent = clipData['date']
            // metadataElem.textContent += ' | '
            // addChildClassed(metadataElem,'clip-publication','a').textContent = clipData['publication']
    
            /*addChildClassed(contentCol,'clip-about','p').textContent = clipData['about']*/
    
            newClip.setAttribute('href',clipData['source'])
    
            newClip.onclick = function() {
                window.open(this.getAttribute('href'),'_self')
            }
        }
    })

    $('#clip-toggle').on('click',function() {
        if ($(this).attr('focus') == 'about') {
            $('#home-display').css('display','none')
            $('#main-clips').css('display','block')
            $(this).attr('focus','clips')
            $(this).html('About <i class="fa-solid fa-circle-info"></i>')
        } else {
            $('#home-display').css('display','block')
            $('#main-clips').css('display','none')
            $(this).attr('focus','about')
            $(this).html('Clips <i class="fa-solid fa-paperclip"></i>')
        }
    })
})