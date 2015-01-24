Ext.data.JsonP.Collection({"tagname":"class","name":"Collection","extends":null,"mixins":[],"alternateClassNames":[],"aliases":{},"singleton":false,"requires":[],"uses":[],"enum":null,"override":null,"inheritable":null,"inheritdoc":null,"meta":{},"private":null,"id":"class-Collection","members":{"cfg":[],"property":[{"name":"add","tagname":"property","owner":"Collection","meta":{},"id":"property-add"},{"name":"indexOf","tagname":"property","owner":"Collection","meta":{},"id":"property-indexOf"},{"name":"length","tagname":"property","owner":"Collection","meta":{},"id":"property-length"},{"name":"removeFirst","tagname":"property","owner":"Collection","meta":{},"id":"property-removeFirst"},{"name":"removeLast","tagname":"property","owner":"Collection","meta":{},"id":"property-removeLast"},{"name":"splice","tagname":"property","owner":"Collection","meta":{},"id":"property-splice"}],"method":[{"name":"constructor","tagname":"method","owner":"Collection","meta":{},"id":"method-constructor"},{"name":"collideAll","tagname":"method","owner":"Collection","meta":{},"id":"method-collideAll"},{"name":"concat","tagname":"method","owner":"Collection","meta":{"chainable":true},"id":"method-concat"},{"name":"draw","tagname":"method","owner":"Collection","meta":{"chainable":true},"id":"method-draw"},{"name":"forEach","tagname":"method","owner":"Collection","meta":{},"id":"method-forEach"},{"name":"remove","tagname":"method","owner":"Collection","meta":{},"id":"method-remove"},{"name":"removeAll","tagname":"method","owner":"Collection","meta":{"chainable":true},"id":"method-removeAll"}],"event":[],"css_var":[],"css_mixin":[]},"linenr":11,"files":[{"filename":"collections.js","href":"collections.html#Collection"}],"html_meta":{},"statics":{"cfg":[],"property":[],"method":[],"event":[],"css_var":[],"css_mixin":[]},"component":false,"superclasses":[],"subclasses":[],"mixedInto":[],"parentMixins":[],"html":"<div><pre class=\"hierarchy\"><h4>Files</h4><div class='dependency'><a href='source/collections.html#Collection' target='_blank'>collections.js</a></div></pre><div class='doc-contents'><p>An Array-like container to keep track of multiple Boxes/Box descendants.</p>\n\n<p>The main reason to use Collections instead of Arrays is that Collections\nhave utility methods to easily process Box objects without manually\niterating over each one. Collection objects can be treated as arrays in\nmany respects; for example, they have a dynamic <code>length</code> property, and they\ncan be read and modified using square-bracket notation (e.g. <code>a[0]</code>)\nalthough new elements should not be added using square brackets (use the\n<code>add()</code> method instead to make sure the <code>length</code> is correctly updated).</p>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-property'>Properties</h3><div class='subsection'><div id='property-add' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Collection'>Collection</span><br/><a href='source/collections.html#Collection-property-add' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Collection-property-add' class='name expandable'>add</a><span> : Object</span></div><div class='description'><div class='short'>Add an item to the Collection. ...</div><div class='long'><p>Add an item to the Collection.</p>\n\n<p>This method works exactly the same way as\n<a href=\"https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/push\">Array#push</a>.</p>\n</div></div></div><div id='property-indexOf' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Collection'>Collection</span><br/><a href='source/collections.html#Collection-property-indexOf' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Collection-property-indexOf' class='name expandable'>indexOf</a><span> : Object</span></div><div class='description'><div class='short'>Returns index of the specified item in the Collection. ...</div><div class='long'><p>Returns index of the specified item in the Collection.</p>\n\n<p>This method works exactly the same way as\n<a href=\"https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/indexOf\">Array#indexOf</a>.</p>\n</div></div></div><div id='property-length' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Collection'>Collection</span><br/><a href='source/collections.html#Collection-property-length' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Collection-property-length' class='name expandable'>length</a><span> : <a href=\"#!/api/Number\" rel=\"Number\" class=\"docClass\">Number</a></span></div><div class='description'><div class='short'>The number of items in the Collection. ...</div><div class='long'><p>The number of items in the Collection.</p>\n<p>Defaults to: <code>0</code></p></div></div></div><div id='property-removeFirst' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Collection'>Collection</span><br/><a href='source/collections.html#Collection-property-removeFirst' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Collection-property-removeFirst' class='name expandable'>removeFirst</a><span> : Object</span></div><div class='description'><div class='short'>Remove and return the first item in the Collection. ...</div><div class='long'><p>Remove and return the first item in the Collection.</p>\n\n<p>This method works exactly the same way as\n<a href=\"https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/shift\">Array#shift</a>.</p>\n</div></div></div><div id='property-removeLast' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Collection'>Collection</span><br/><a href='source/collections.html#Collection-property-removeLast' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Collection-property-removeLast' class='name expandable'>removeLast</a><span> : Object</span></div><div class='description'><div class='short'>Remove and return the last item in the Collection. ...</div><div class='long'><p>Remove and return the last item in the Collection.</p>\n\n<p>This method works exactly the same way as\n<a href=\"https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/pop\">Array#pop</a>.</p>\n</div></div></div><div id='property-splice' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Collection'>Collection</span><br/><a href='source/collections.html#Collection-property-splice' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Collection-property-splice' class='name expandable'>splice</a><span> : Object</span></div><div class='description'><div class='short'>Changes the content of a Collection by adding and/or removing elements. ...</div><div class='long'><p>Changes the content of a Collection by adding and/or removing elements.</p>\n\n<p>This method works exactly the same way as\n<a href=\"https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/splice\">Array#splice</a>.</p>\n</div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-constructor' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Collection'>Collection</span><br/><a href='source/collections.html#Collection-method-constructor' target='_blank' class='view-source'>view source</a></div><strong class='new-keyword'>new</strong><a href='#!/api/Collection-method-constructor' class='name expandable'>Collection</a>( <span class='pre'></span> ) : <a href=\"#!/api/Collection\" rel=\"Collection\" class=\"docClass\">Collection</a></div><div class='description'><div class='short'>Creates a new Collection instance. ...</div><div class='long'><p>Creates a new Collection instance.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'></span> : Arguments<div class='sub-desc'><p>...\n  An Array of items that the Collection should hold.</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'><a href=\"#!/api/Collection\" rel=\"Collection\" class=\"docClass\">Collection</a></span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-collideAll' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Collection'>Collection</span><br/><a href='source/collections.html#Collection-method-collideAll' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Collection-method-collideAll' class='name expandable'>collideAll</a>( <span class='pre'>[callback]</span> ) : Boolean</div><div class='description'><div class='short'>Check each pair of items in this Collection for collision. ...</div><div class='long'><p>Check each pair of items in this Collection for collision.</p>\n\n<p>This method assumes every item in the Collection has an \"overlaps\"\nmethod.</p>\n\n<p>To check all items in a Collection against a single Box, use the\n<a href=\"#!/api/Box-method-collides\" rel=\"Box-method-collides\" class=\"docClass\">Box.collides</a>() method. To check all items in a Collection against all\nitems in another Collection, use the following pattern:</p>\n\n<pre><code>collection1.forEach(function(item) {\n  if (item.collides(collection2)) {\n    // do something\n  }\n});\n</code></pre>\n\n<p>In the example above, to get the Boxes that collide with each item, simply\npass <code>true</code> as the second parameter to <code>item.collides()</code> and note the\nreturn value.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>callback</span> : Function (optional)<div class='sub-desc'><p>A function to call for each pair of items in this Collection that\n  collide.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>a</span> : Mixed (optional)<div class='sub-desc'><p>An item in the Collection that overlaps.</p>\n</div></li><li><span class='pre'>b</span> : Mixed (optional)<div class='sub-desc'><p>An item in the Collection that overlaps.</p>\n</div></li></ul></div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Boolean</span><div class='sub-desc'><p>Whether items in this Collection collide.</p>\n</div></li></ul></div></div></div><div id='method-concat' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Collection'>Collection</span><br/><a href='source/collections.html#Collection-method-concat' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Collection-method-concat' class='name expandable'>concat</a>( <span class='pre'></span> ) : <a href=\"#!/api/Collection\" rel=\"Collection\" class=\"docClass\">Collection</a><strong class='chainable signature' >chainable</strong></div><div class='description'><div class='short'>Add the items in an Array or another Collection to this Collection. ...</div><div class='long'><p>Add the items in an Array or another Collection to this Collection.</p>\n\n<p>See Collection#combine() to add the items in another Collection to this\nCollection.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'></span> : Arguments<div class='sub-desc'><p>...\n  Array(s) or Collection(s) of Boxes to add to the Collection.</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'><a href=\"#!/api/Collection\" rel=\"Collection\" class=\"docClass\">Collection</a></span><div class='sub-desc'><p>this</p>\n</div></li></ul></div></div></div><div id='method-draw' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Collection'>Collection</span><br/><a href='source/collections.html#Collection-method-draw' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Collection-method-draw' class='name expandable'>draw</a>( <span class='pre'>[ctx]</span> ) : <a href=\"#!/api/Collection\" rel=\"Collection\" class=\"docClass\">Collection</a><strong class='chainable signature' >chainable</strong></div><div class='description'><div class='short'>Draw every object in the Collection. ...</div><div class='long'><p>Draw every object in the Collection.</p>\n\n<p>This calls <a href=\"#!/api/Box-method-draw\" rel=\"Box-method-draw\" class=\"docClass\">Box.draw</a>() on every Box in the Collection.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>ctx</span> : <a href=\"#!/api/CanvasRenderingContext2D\" rel=\"CanvasRenderingContext2D\" class=\"docClass\">CanvasRenderingContext2D</a> (optional)<div class='sub-desc'><p>A canvas graphics context onto which to draw. This is useful for drawing\n  onto <a href=\"#!/api/Layer\" rel=\"Layer\" class=\"docClass\">Layer</a>s. If not specified, defaults to the\n  <a href=\"#!/api/global-property-context\" rel=\"global-property-context\" class=\"docClass\">global context</a> for the default canvas.</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'><a href=\"#!/api/Collection\" rel=\"Collection\" class=\"docClass\">Collection</a></span><div class='sub-desc'><p>this</p>\n</div></li></ul></div></div></div><div id='method-forEach' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Collection'>Collection</span><br/><a href='source/collections.html#Collection-method-forEach' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Collection-method-forEach' class='name expandable'>forEach</a>( <span class='pre'>f</span> )</div><div class='description'><div class='short'>Execute a function on every item in the Collection. ...</div><div class='long'><p>Execute a function on every item in the Collection.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>f</span> : Function/String<div class='sub-desc'><p>The function to execute on each item, or the (string) name of a method\n  of each object in the Collection that should be invoked. In the first\n  case, the function should return a truthy value in order to remove the\n  item being processed from the Collection. In the second case, additional\n  arguments to the forEach method are also passed on to the items' method.</p>\n</div></li></ul></div></div></div><div id='method-remove' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Collection'>Collection</span><br/><a href='source/collections.html#Collection-method-remove' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Collection-method-remove' class='name expandable'>remove</a>( <span class='pre'>item</span> ) : Object</div><div class='description'><div class='short'>Remove an item from the Collection. ...</div><div class='long'><p>Remove an item from the Collection.</p>\n\n<p>See <a href=\"#!/api/Collection-property-removeLast\" rel=\"Collection-property-removeLast\" class=\"docClass\">Collection.removeLast</a>() to pop the last item in the collection.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>item</span> : Mixed<div class='sub-desc'><p>The item to remove from the Collection.</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Object</span><div class='sub-desc'><p>Array\n  An Array containing the removed element, if any.</p>\n</div></li></ul></div></div></div><div id='method-removeAll' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Collection'>Collection</span><br/><a href='source/collections.html#Collection-method-removeAll' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Collection-method-removeAll' class='name expandable'>removeAll</a>( <span class='pre'></span> ) : <a href=\"#!/api/Collection\" rel=\"Collection\" class=\"docClass\">Collection</a><strong class='chainable signature' >chainable</strong></div><div class='description'><div class='short'>Remove all items in the Collection. ...</div><div class='long'><p>Remove all items in the Collection.</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'><a href=\"#!/api/Collection\" rel=\"Collection\" class=\"docClass\">Collection</a></span><div class='sub-desc'><p>this</p>\n</div></li></ul></div></div></div></div></div></div></div>"});