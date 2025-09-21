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
    // $(".outlink").click(function() {
    //     window.location = $(this).attr("href"); 
    //     return false;
    // });

    const clipHolder = document.querySelector('#main-clips')

    d3.json('portfolio.json')
    .then(data => { 
        console.log(data)
        data = data['clips']
        for (var i=0; i<data.length; i++) {
            var clipData = data[i];
    
            var newClip = addChildClassed(clipHolder,'clip', tag='a')
    
            var imageCol = addChildClassed(newClip,'clip-image-column')
            imageCol.classList.add('column')
            var contentCol = addChildClassed(newClip,'clip-content-column')
            contentCol.classList.add('column')
    
            var clipImage = addChildClassed(imageCol,'clip-image','img')
            clipImage.setAttribute('src',clipData['image'])
    
            if ('award' in clipData) {
                addChildClassed(contentCol,'clip-award','p').textContent = clipData['award']
            }
            addChildClassed(contentCol,'clip-title','h2').textContent = clipData['title']
    
            var metadataElem = addChildClassed(contentCol,'clip-metadata','p')
            addChildClassed(metadataElem,'clip-date','a').textContent = clipData['date']
            metadataElem.textContent += ' | '
            addChildClassed(metadataElem,'clip-publication','a').textContent = clipData['publication']
    
            /*addChildClassed(contentCol,'clip-about','p').textContent = clipData['about']*/
    
            newClip.setAttribute('href',clipData['link'])
            newClip.setAttribute('type',clipData['type'])
    
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