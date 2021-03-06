
class FormWizard {

	constructor(steps, action, container){
		this.steps = steps.map((e, i) => {
			return new FormStep(e.props, e.beforeNextStep, e.afterRender);
		})
		this.container = container;
		this.activeStep = 0;
		this.actionUrl = action;
		this.isRendered = false;
	}

	getContainer(){
		return this.container;
	}

	save(){


	}

	findStep(id){
		return this.steps.filter((e, i) => {
			  return e.getId() === id;
		})[0] || null;
	}

	updateStep(){

		let nextStep = this.activeStep + 1;

		this.activeStep = nextStep < this.steps.length
		                  ? nextStep
		                  : this.activeStep;

	    let activeStepInstance =  this.steps[this.activeStep];

			this.render();

			if(activeStepInstance.afterRender){
	    	activeStepInstance.afterRender();
	    }

	}

	render(){

		let activeStep =  this.steps[this.activeStep];
		//Set the icon as Active
		let icon = activeStep.getIconClass();
		//get the stepItem
		let stepItem = $(icon).closest(".step__item")

		this.container.find(".step__item")
					  .removeClass("active");
		stepItem.addClass("active")

		this.container.find(".stepsContainer").html( `
			<form action = ${this.actionUrl} >
				${activeStep.html()}
			</form>
		`);

		if(!this.isRendered){
			this.isRendered = true;
			FormStep.initEvents(this);
		}

	}
}


class FormStep {

	static className = ".stepContainer";
	static nextStepClass = ".nextStep";

    constructor(props, beforeNextStep, afterRender){
    	this.isValid = true;
    	this.props = props;
    	this.beforeNextStep = beforeNextStep ;
    	this.afterRender = afterRender;
    }
    getId(){
    	return this.props.id;
    }
    getIconClass(){
    	return this.props.iconClass;
    }
    isFinalStep(){
    	return this.props.isFinalStep;
    }
    validate(){

    	// Si no es el primer estado no se valida;
    	if(!this.props.isInitialState){
				this.isValid = true;
    	}

       return this.isValid;
    }

    static initEvents(formWizard){

    	let wizardContainer = formWizard.getContainer();

    	//Selector del boton siguiente del step container
    	let nextStepSelectorBtn =  FormStep.className + " " + FormStep.nextStepClass;

    	wizardContainer.on("click", nextStepSelectorBtn, function(e){
    		e.preventDefault();

    		// Se obtiene la instancia de la clase quien hizo click por si Id.
    		let id = $(this).closest(FormStep.className).attr("data-id");
    		let instance = formWizard.findStep(id);
    		let isValid = instance.validate();

    		if(!isValid){
    			//aparecer un mensaje de Error
    			return;
    		}

				let beforeNextStep = instance.beforeNextStep;
				let fnResult = new Promise(function(resolve, reject){
					resolve();
				});

				if(beforeNextStep){
					 fnResult = instance.beforeNextStep(wizardContainer );
				}

				fnResult.then(() => {
					// Se verifica si no es el ultimo estado
					if(!instance.isFinalStep()){
						formWizard.updateStep();
					}else{
						//Se guarda/envía la info
						formWizard.save();
					}

				}, () => {

						console.log("Error");
				})

    	})

    }

    html(){

    	return `
			<section data-id=${this.props.id} class='stepContainer'>
				<h2> ${this.props.title} </h2>
				${this.props.template}
			</section>
    	`;
    }

}


class ProductComp {

	static viewClassName = "product_container";
	constructor(p){
		this.id = ProductComp.genID();
		this.name =  p.name;
		this.description = p.description;
		this.price = p.price;
		this.currencyAbbr = p.currencyAbbr;
		this.mainPictureURL = p.mainPictureURL;
		this.rank = p.rank;
	}
	static genID(){

	  function s4() {
	    return Math.floor((1 + Math.random()) * 0x10000)
	      .toString(16)
	      .substring(1);
	  }
	  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
	    s4() + '-' + s4() + s4() + s4();

	}
	getId(){
		return this.id;
	}
	getName(){
		return this.name;
	}
	getDescription(){
		return this.description
	}
	getPrice(){
		return this.price;
	}
	getCurrency(){
		return this.currencyAbbr;
	}
	getPictureUrl(){
		return this.mainPictureURL;
	} 
	getRank() {
		return this.rank;
	}
	setPictureUrl(url){
		this.mainPictureURL =  url;
	}

	html(){

		return `
			 	<li data-id="${this.id}" class="${ProductComp.viewClassName} collection-item avatar">
		      <img src="${this.mainPictureURL}" alt="" class="circle">
		      <div class='content-container'>
			      <span class="title">${this.name}</span>
			      <p style="word-wrap: break-word;">
				      	${this.description} <br>
				       <span> ${this.price}</span>
				       <span> ${this.currencyAbbr}</span>
					   <select  name="newProductRating" class="rating">
	                      <option value="1">1</option>
	                      <option value="2">2</option>
	                      <option value="3">3</option>
	                      <option value="4">4</option>
	                      <option value="5">5</option>
		               </select>
			      </p>
		      </div>

		      <div class="secondary-content">
			      <a href="#" class="showProduct"><i class="material-icons">mode_edit</i></a>

			      <a href="#" class="deleteProduct"><i class="material-icons">delete</i></a>

		      </div>

		    </li>
		`

	}
	reRender(){
		//get the product element
		var productViewElement= $("[data-id='" + this.getId() + "']");

		//replace the html with the new one
		productViewElement.replaceWith(this.html());

		var ratingStars = $("[data-id='"+this.getId()+"'] .rating");
		ratingStars.barrating({
	        theme: 'css-stars',
	        showSelectedRating: false,
	        readonly: true
  	});
		ratingStars.barrating('set',this.rank)

	}
	setProperties(props){
		 Object.assign(this, props);
		 return this;
	}
}

class ProductsAdmin {

	static viewClassName = "product_admin_container";

	constructor(container, products, productModalId){
		this.products = products.map( (p, i) => {
			return new ProductComp(p);
		});
		this.container = container;
		this.isRendered = false;
		this.productModal = new ProductModal(productModalId, this);
	}

	findProduct(id){
		return this.products.filter((p, i) => {
			 return p.getId() === id;
		})[0];
	}
	updateProduct(id, properties){
		// we find the instance with that id
		var product = this.findProduct(id);
		product.setProperties(properties);
		product.reRender();
		return product;
	}

	deleteProduct(product) {
		if(product) {
				// First we delete it from the view.
			$("[data-id='"+product.getId()+"']").remove();

			// then we find it in our array and delete it.
			var pos = this.products.indexOf(product);
			if(pos != -1) {
				this.products.splice(pos, 1);
			}
		}
	}
	getContainer(){
		return this.container;
	}
	

	getProducts(string = false){

		if(string) {
			return JSON.stringify(this.products);
		}

		return this.products;
	}
	html(){

		let productsView = this.products.map( (p, i) => {
			return p.html();
		});

		var noProductsMessage = '';
		productsView = productsView.length > 0 ? productsView.join("") : noProductsMessage;
		return `
			 <div class="row">
					<div class="right-align">
							<a class="btnAddProduct btn-floating btn-large green" href="${this.productModal.getView()}">
					            <i class="material-icons">library_add</i>
					        </a>
					</div>
			 </div>
			 <ul class="${ProductsAdmin.viewClassName} collection">
					${productsView}
			 </ul>
		`
	}
	static initEvents(productAdminInstance){
		// Input Change Event.
		let container = productAdminInstance.getContainer();

		$("body").on("change", ".image_view_input_file", function(e){

			//Read the input content.
			var tgt = e.target || window.event.srcElement,
       		files = tgt.files;
       		var input = $(this);
			var fr = new FileReader();

	        fr.onload = function () {
	            let url = fr.result;
	            //Changing the img url...
	           	//get the image tag
				var imageTag = input.closest(".image_view_loader_container")
									  .find(".img_view");
				//set the url to the img
				imageTag.attr("src",  url);

	        }
	        fr.readAsDataURL(files[0]);

		})

		
		container.on("click", ".btnAddProduct", function(e){
			e.preventDefault();

			productAdminInstance.productModal.showModal();

		});

		// Show or edit product information
		container.on("click", "." + ProductsAdmin.viewClassName + " .showProduct", function(e){
				e.preventDefault();

				var showBtn = $(this);
				//get the product class name view
				var productContainerClass = "."+ProductComp.viewClassName;
				//get the product container
				var productContainer =  showBtn.closest(productContainerClass);
				var productId =  productContainer.attr("data-id");
				//let's look for the productComp instance
				var product = productAdminInstance.findProduct(productId);

				// Now we load the product information in the modal
			  productAdminInstance.productModal.loadInfo(product);
		});

		// Delete product from the list
		container.on("click", "." + ProductsAdmin.viewClassName + " .deleteProduct", function(e){
				e.preventDefault();

				var deleteBtn = $(this);
				//get the product class name view
				var productContainerClass = "."+ProductComp.viewClassName;
				//get the product container
				var productContainer =  deleteBtn.closest(productContainerClass);
				var productId =  productContainer.attr("data-id");

				//let's look for the productComp instance
				var product = productAdminInstance.findProduct(productId);

				// Now we pass the product to be deleted
			  productAdminInstance.deleteProduct(product);
		});

		$("body").on("click", "#" + productAdminInstance.productModal.getView().attr('id') + " .saveProductBtn", function(e){
			e.preventDefault();

			productAdminInstance.productModal.save();

		});

		$("body").on("click", "#" + productAdminInstance.productModal.getView().attr('id') + " .cancelBtn", function(e){
			e.preventDefault();
			productAdminInstance.productModal.clear();

		});

		container.on("click", "."+ProductComp.viewClassName + " .btnAddProduct", function(e){
			e.preventDefault();

			productAdminInstance.productModal.showModal();

		});

		$("#" + productAdminInstance.productModal.getView().attr('id') + ' .rating').barrating({
	        theme: 'css-stars',
	        showSelectedRating: false,
  	});
	 	

	}
	render(){
		this.container.html( this.html() );
		if(!this.isRendered){
			this.isRendered = true;
		}
	}
	addProductToList(product){
		let container = "." + ProductsAdmin.viewClassName;

		//Push the new product to the product list
		this.products.push(product);

		// We append the product view to the the container
		$(container).append(product.html());

		var ratingStars = $("[data-id='"+product.getId()+"'] .rating");
		ratingStars.barrating({
	        theme: 'css-stars',
	        showSelectedRating: false,
	        readonly: true
  	});
		ratingStars.barrating('set',product.rank);

	}
}

class ClientsAdmin{

	static viewClassName =  "clientsList";

	constructor(clients, container, trans) {
		this.clients  = clients.map(function(e, i){
			 return new ClientComp(e, this);
		});		
		this.container =  container;		
		this.isRendered = false;
		this.trans = trans;
	}
	getContainer(){
		return this.container;
	}
	getClientsList(){
		let clients = this.container.find("."+ ClientsAdmin.viewClassName);
		return clients;
	}
	addClient(clientInstance){
		this.clients.push(clientInstance)
	}
	getTrans(){
		return this.trans;
	}
	getClients(string = false){
		let clients = this.clients.map(function(e, i ){
			return {
				name : e.name,
				mainPictureURL: e.imgUrl,
			}
		});

		if(string) return JSON.stringify(clients)

		return clients;
		
	}
	findClient(id, getIndex = false){

		let index = -1;
		let obj = this.clients.filter(function(e,i){
			if(e.getId() === id) index = i;
			return e.getId() === id;
		})[0];

		return !getIndex ? obj : index;
	}
	verifyAndSaveItem(notSavedItem, fn){

		let container =  this.container;
		
		if(notSavedItem.length == 0){
			return;
		}

		let cancel = false;

		let e = notSavedItem;
		let name = $(e).find(".inputName").val();
		let imgUrl =  $(e).find("img").attr("src")
		
		let itemContainer = $(e);
		let id = itemContainer.data("id");
		let clientInstance = this.findClient(id);

		if(name.trim() === ""){
			
			if(clientInstance){
				 this.deleteClient(clientInstance);
			}

		}else{
			fn({name:name, imgUrl: imgUrl}, clientInstance);
		}

		$(e).remove();
	}

	deleteClient(instance){
		let index = this.findClient(instance.getId(), true);
		this.clients.splice(index, 1);
	}
	render(){

		let containerView = ` 
			<div class="row">
					<div class="right-align">
							<a class="btnAddClient btn-floating btn-large green" href="#">
					            <i class="material-icons">library_add</i>
					        </a>
					</div>
			 </div>
			 <ul class="${ClientsAdmin.viewClassName} collection collection-client">
					${
					 	this.clients.map(function(e, i){
							return  ClientComp.html(e);
					 	}).join("")
				 	}
			 </ul>
		`;

		this.container.html(containerView);

		if(!this.isRendered){
			this.isRendered = true;
		}
	}
	editClient(clientInstance){
		this.getClientsList()
			.find("."+ClientComp.viewClassName + "[data-id='"+clientInstance
			.getId()+"']")
			.replaceWith(ClientComp.html(clientInstance, 'edit'));

	}

	static initEvents(instance){

		let container = instance.getContainer();
		
		let addBtn =  container.find(".btnAddClient");
		let clientClass =  "." + ClientComp.viewClassName;

		container.on("click", clientClass + " img", function(e){

			let inputFile = $(this).closest(clientClass).find(".inputFile");

			inputFile.trigger("click");
		});
	
		container.on("click", ".editClient", function(e){
			e.preventDefault();
			let itemContainer = $(this).closest('.' + ClientComp.viewClassName)
			let id = itemContainer.data("id");
			let clientInstance = instance.findClient(id);
			instance.editClient(clientInstance);
		});

		container.on("click", ".deleteClient", function(e){
			e.preventDefault();
			let itemContainer = $(this).closest('.' + ClientComp.viewClassName)
			let id = itemContainer.data("id");
			let clientInstance = instance.findClient(id);

			itemContainer.fadeOut(function(){
				$(this).remove();
			})
			if(!clientInstance){
				return;
			}

			instance.deleteClient(clientInstance);
			
		});

		container.on("click", ".saveClient", function(e){
			e.preventDefault();

			let clientContainer  = $(this).closest("." + ClientComp.viewClassName)
		
			instance.verifyAndSaveItem(clientContainer, function(clientData, clientInstance){

				if(!clientInstance){
					//it's a new one!
					let newClient = new ClientComp(clientData, instance);
					instance.addClient(newClient);
					newClient.render();
					return;
				}

				clientInstance.update(clientData);
				clientInstance.reRender();
				
			});

		});

		addBtn.on("click", function(e){

			e.preventDefault();

			/*instance.verifyAndSaveItem(function(clientData, clientInstance){

				let newClient = new ClientComp(clientData, instance);
				instance.addClient(newClient);
				newClient.render();
			})
*/
			let editorHtml = ClientComp.html(new ClientComp({new:true}, instance), 'edit');
			$("."+ClientsAdmin.viewClassName).append(editorHtml);

		});

		container.on("change", clientClass + " .inputFile",  function(e){

			//Read the input content.
			var tgt = e.target || window.event.srcElement,
       		files = tgt.files;
       		var input = $(this);
			var fr = new FileReader();

	        fr.onload = function () {
	            let url = fr.result;
	            //Changing the img url...
	           	//get the image tag
				var imageTag = input.closest(clientClass).find("img").eq(0);
				//set the url to the img
				imageTag.attr("src",  url);

	        }
	        fr.readAsDataURL(files[0]);

		});
	}
}

class ClientComp {

	static viewClassName = 'clientContainer';

	constructor(props = [], clientsAdminInstance){
		Object.assign(this, props);
		this.id =  ClientComp.genID();
		this.clientsAdmin =  clientsAdminInstance;
	}
	static genID(){

	  function s4() {
	    return Math.floor((1 + Math.random()) * 0x10000)
	      .toString(16)
	      .substring(1);
	  }
	  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
	    s4() + '-' + s4() + s4() + s4();

	}
	getAdmin(){
		return this.clientsAdmin;
	}
	getId(){
		return this.id;
	}
	getName(){
		return this.name;
	}
	getImg(){
		return this.imgUrl;
	}

	reRender(){
		this.clientsAdmin.getClientsList().find("."+ClientComp.viewClassName + "[data-id='"+this.id+"']").replaceWith(ClientComp.html(this));
	}
	update(data){
		Object.assign(this, data);
	}

	static html(instance, view = 'show'){


		let name = instance.getName() || "";
		let img =  instance.getImg() || Resourses.addLogoDefaultImg;
		let trans = instance.getAdmin().getTrans();
		let placeHolder = trans.clientPlaceHolder;

		let inputControl = view === 'edit' ?  '<input placeHolder="' + placeHolder + '" type="text" value="'+ name  +'" class="inputName validate">' :  '<span class="title">' + instance.getName() +'</span>';

		let editControl =  view !== 'edit' ?  '<a href="#" class="editClient"><i class="material-icons">mode_edit</i></a>' : '<a href="#" class="saveClient"><i class="material-icons">mode_save</i></a>';

		return `
			<li data-id="${instance.getId()}" data-view= '${view}' class="${ClientComp.viewClassName} collection-item avatar">
		      <img src="${img}" alt="" class="circle" title="${trans.clientImgTitle}">
		      <input class="inputFile" type="file" style="display:none" />
		      ${inputControl}


			     <div class="secondary-content">
					 ${editControl}
				      <a href="#" class="deleteClient"><i class="material-icons">delete</i></a>

			      </div>

		    </li>
		 `;
	}

	render(){
		this.clientsAdmin.getClientsList().append(ClientComp.html(this))
	}

}

class ProductModal {

	static fields = {
		name: ".name",
		description: ".description",
		price: ".price",
		currency: ".currency",
		picture: ".img_view",
		rank: ".rating",
		inputFile: ".image_view_input_file"
	}

	constructor(view, productAdminInstance){
		this.view = view;

		this.productAdminInstance = productAdminInstance;
	}
	showModal(){
		this.view.openModal({dismissible:false});
	}
	getView(){
		return this.view;
	}
	hideModal(){
		this.view.closeModal();
	}
	loadInfo(product){
		this.view.attr("productId", product.getId());
		this.view.find(ProductModal.fields.name).val(product.getName());
		this.view.find(ProductModal.fields.description).val(product.getDescription());
		this.view.find(ProductModal.fields.price).val(product.getPrice());
		this.view.find(ProductModal.fields.currency).val(product.getCurrency());
		this.view.find(ProductModal.fields.picture).attr("src", product.getPictureUrl());
		this.view.find(ProductModal.fields.rank).val(product.getRank());

		var ratingStars = this.view.find('.rating');
		ratingStars.barrating('set', product.getRank())

		// then we open the modal
		this.showModal();
	}

	save(){

		// Take the values from the inputs
		let id = this.view.attr('productId') ? this.view.attr('productId') : null ;
		let nameField =  this.view.find(ProductModal.fields.name);

		let name = nameField.val();
		if(name.trim() === ""){
			nameField.addClass("invalid");
			return false;	
		}

		let description = this.view.find(ProductModal.fields.description).val();
		let price = this.view.find(ProductModal.fields.price).val();
		let currency = this.view.find(ProductModal.fields.currency).val();
		let picture = this.view.find(ProductModal.fields.picture).attr("src");
		let rank = this.view.find(ProductModal.fields.rank).val();

		let productInfo = {
			name: name,
			description: description,
			price: price,
			currencyAbbr: currency,
			mainPictureURL: picture,
			rank: rank
		}

		// If it's not a new instance, which has an id already assigned...
		if(id) {
			this.productAdminInstance.updateProduct(id, productInfo);
		} else {
			var newProductComp = new ProductComp(productInfo);
			this.productAdminInstance.addProductToList(newProductComp);
		}

		this.hideModal();

		this.clear();
	}
	clear() {
		this.view.attr('productId', "") ;
		this.view.find(ProductModal.fields.name).val("");
		this.view.find(ProductModal.fields.description).val("");
		this.view.find(ProductModal.fields.price).val("");
		this.view.find(ProductModal.fields.currency).val("");
		this.view.find(ProductModal.fields.picture).attr("src","");
		this.view.find(ProductModal.fields.rank).val("");
		let input = this.view.find(ProductModal.fields.inputFile)
		input.replaceWith(input = input.clone( true ))
		this.view.find(".file-path").val("");
		this.view.find('.rating').barrating('set', 1);
	}

}


