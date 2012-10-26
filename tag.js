/*
	jQuery Plugin
*/

(function($){
	$.fn.tagInput = function(options){
		var defaultOptions = {
			nameData: [],
			idData: [],
			hiddenInputNamePrefix: 'tag_',
			alreadyAttachedIndices: []
		};
		
		/* private variables */
		var settings = $.extend(defaultOptions, options);
		var $container;
		var $tagInputBox;
		var $tagAddButton;
		var $suggestions;
		var $attached;
	
		/* Element Construction */
		function buildSuggestion(index)
		{
			var $div = $('<div></div>').html(settings.nameData[index]).attr('tagIndex', index);
			$div.click(onSuggestionClick);
			$suggestions.append($div);
		}
		
		function buildTag(index)
		{
			var inputName = settings.hiddenInputNamePrefix + settings.idData[index];
			var $nameSpan = $('<span></span>').html(settings.nameData[index]);
			var $hiddenInput = $('<input></input>').attr('type', 'hidden').attr('name', inputName).val('1');
			var $removeButton = $('<button>Remove</button>');
			$removeButton.click(onRemoveButtonClick);
			
			var $singleTagContainer = $('<div></div>').append($nameSpan).append($hiddenInput).append($removeButton);
			$attached.append($singleTagContainer);
		}
		
		/* Events */
		function matchAndAddTag()
		{
			var textToMatch = $tagInputBox.val();
			if(textToMatch.trim() == '')
				return;
			var numItemsToCheck = settings.nameData.length;
			for(var i=0; i<numItemsToCheck; i++)
				if(settings.nameData[i].indexOf(textToMatch) >= 0)
				{
					buildTag(i);
					return;
				}
		}
		
		function onInputTextChange(event)
		{
			// the user hit enter
			if(event && event.which && event.which == 13)
			{
				matchAndAddTag();
			}
			
			// update suggestions
			$('div', $suggestions).remove();
			
			var textToMatch = $tagInputBox.val();
			var numItemsToCheck = settings.nameData.length;
			for(var i=0; i<numItemsToCheck; i++)
				if(settings.nameData[i].indexOf(textToMatch) >= 0)
					buildSuggestion(i);
			
			if(textToMatch.trim().length > 0)
				$suggestions.show();
			else
				$suggestions.hide();
		}
		
		function onRemoveButtonClick()
		{
			$(this).parent().remove();
		}
		
		function onSuggestionClick()
		{
			// get the index of the element that was clicked
			var index = $(this).attr('tagIndex');
			index = parseInt(index);
			
			buildTag(index);
		}
	
		/* Main Setup */
		function buildUnit()
		{
			// Input row
			$tagInputBox = $('<input></input>').attr('type', 'text').addClass('tagInputBox');
			$tagAddButton = $('<input></input>').attr('type', 'button').val('Add').addClass('tagAddButton');
			$firstRow = $('<div></div>').addClass('tagInput').append($tagInputBox).append($tagAddButton);
			$container.append($firstRow);
			
			// suggestion row
			$suggestions = $('<div></div>').addClass('tagSuggestionsContainer').hide();
			$container.append($suggestions);
			
			// already added
			$attached = $('<div></div>').addClass('attachedTagsContainer');
			$container.append($attached);
		}
		
		function attachEvents()
		{
			$tagInputBox.change(onInputTextChange);
			$tagInputBox.keyup(onInputTextChange);
			$tagAddButton.click(matchAndAddTag);
		}
		
		function preAttachItems()
		{
			var length = settings.alreadyAttachedIndices.length;
			for(var i=0; i<length; i++)
				buildTag(settings.alreadyAttachedIndices[i]);
		}
		
		return this.each(function(){
			$container = $(this);
			buildUnit();
			attachEvents();
			preAttachItems();
		});
	}
})(jQuery);