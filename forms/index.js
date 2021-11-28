const forms = require("forms")
const fields = forms.fields
const validators = forms.validators
const widgets = forms.widgets


const {validate_exist_email, validate_exist_display_name, validate_decimal} = require('../custom_validator')




var bootstrap = function (name, object) {
    if (!Array.isArray(object.widget.classes)) { object.widget.classes = [] }

    if (object.widget.classes.indexOf('form-control') === -1) {
        object.widget.classes.push('form-control')
    }

    var validationclass = object.value && !object.error ? 'is-valid' : ''
    validationclass = object.error ? 'is-invalid' : validationclass
    if (validationclass) {
        object.widget.classes.push(validationclass)
    }

    var label = object.labelHTML(name)
    var error = object.error ? '<div class="invalid-feedback">' + object.error + '</div>' : ''

    var widget = object.widget.toHTML(name, object)
    return '<div class="form-group">' + label + widget + error + '</div>'
}

const create_game_form=(categories, content_tags, platforms)=>{
    return forms.create({
        "title":fields.string({
            "label":'Title',
            "required":true,
            "errorAfterField":true,
            "cssClasses": {
                "label": ['form-label']
            },
            'validators':[validators.maxlength(50)]
        }),
        'cost': fields.string({
            "label":'Cost',
            "required":true,
            "errorAfterField":true,
            "cssClasses": {
                "label": ['form-label']
            },
            'validators':[validate_decimal()]
        }),
        'discount': fields.string({
            "label":'Discount (in n)',
            "required":true,
            "errorAfterField":true,
            "cssClasses": {
                "label": ['form-label']
            },
            'validators':[validators.max(100), validators.integer()]
        }),
        'description': fields.string({
            "label":'Description',
            "required":true,
            "errorAfterField":true,
            "cssClasses": {
                "label": ['form-label']
            },
            "widget": widgets.textarea(),
            'validators':[validators.maxlength(600)]
        }),
        'recommended_requirement': fields.string({
            "label":'Recommended Requirement',
            "required":true,
            "errorAfterField":true,
            "cssClasses": {
                "label": ['form-label']
            },
            "widget": widgets.textarea(),
            'validators':[validators.maxlength(600)]
        }),
        'minimum_requirement': fields.string({
            "label":'Minimum Requirement',
            "required":true,
            "errorAfterField":true,
            "cssClasses": {
                "label": ['form-label']
            },
            "widget": widgets.textarea(),
            'validators':[validators.maxlength(600)]
        }),
        'banner_image': fields.string({
            "label":'Banner Image',
            "required":true,
            "errorAfterField":true,
            // widget: widgets.hidden()
        }),
        'banner_image_thumbnail': fields.string({
            "label":'Banner Image Thumbnail',
            "required":true,
            "errorAfterField":true,
            // widget: widgets.hidden()
        }),
        'url_1': fields.string({
            "label":'Game Image 1',
            "required":false,
            widget: widgets.hidden()
        }),
        'url_2': fields.string({
            "label":'Game Image 2',
            "required":false,
            widget: widgets.hidden()
        }),
        'url_3': fields.string({
            "label":'Game Image 3',
            "required":false,
            widget: widgets.hidden()
        }),
        'url_4': fields.string({
            "label":'Game Image 4',
            "required":false,
            widget: widgets.hidden()
        }),
        'url_5': fields.string({
            "label":'Game Image 5',
            "required":false,
            widget: widgets.hidden()
        }),
        'url_1_thumbnail': fields.string({
            "label":'Game Image 1 Thumbnail',
            "required":false,
            // widget: widgets.hidden()
        }),
        'url_2_thumbnail': fields.string({
            "label":'Game Image 2 Thumbnail',
            "required":false,
            // widget: widgets.hidden()
        }),
        'url_3_thumbnail': fields.string({
            "label":'Game Image 3 Thumbnail',
            "required":false,
            widget: widgets.hidden()
        }),
        'url_4_thumbnail': fields.string({
            "label":'Game Image 4 Thumbnail',
            "required":false,
            widget: widgets.hidden()
        }),
        'url_5_thumbnail': fields.string({
            "label":'Game Image 5 Thumbnail',
            "required":false,
            widget: widgets.hidden()
        }),
        'review_1': fields.string({
            "label":'Review 1',
            "required":false,
            "cssClasses": {
                "label": ['form-label']
            },
            'validators':[validators.maxlength(200), validators.regexp(/\|+\w+/g,"Incorrect format. Remember to add '|' character in this format: &ltdescription&gt|&ltreview aggregator company&gt")]
        }),
        'review_2': fields.string({
            "label":'Review 2',
            "required":false,
            "cssClasses": {
                "label": ['form-label']
            },
            'validators':[validators.maxlength(200), validators.regexp(/\|+\w+/g,"Incorrect format. Remember to add '|' character in this format: &ltdescription&gt|&ltreview aggregator company&gt")]
        }),
        'review_3': fields.string({
            "label":'Review 3',
            "required":false,
            "cssClasses": {
                "label": ['form-label']
            },
            'validators':[validators.maxlength(200), validators.regexp(/\|+\w+/g,"Incorrect format. Remember to add '|' character in this format: &ltdescription&gt|&ltreview aggregator company&gt")]
        }),
        'review_4': fields.string({
            "label":'Review 4',
            "required":false,
            "cssClasses": {
                "label": ['form-label']
            },
            'validators':[validators.maxlength(200), validators.regexp(/\|+\w+/g,"Incorrect format. Remember to add '|' character in this format: &ltdescription&gt|&ltreview aggregator company&gt")]
        }),
        'review_5': fields.string({
            "label":'Review 5',
            "required":false,
            "cssClasses": {
                "label": ['form-label']
            },
            'validators':[validators.maxlength(200), validators.regexp(/\|+\w+/g,"Incorrect format. Remember to add '|' character in this format: &ltdescription&gt|&ltreview aggregator company&gt")]
        }),
        'company_name': fields.string({
            "label":'Company Name',
            "required":true,
            "errorAfterField":true,
            "cssClasses": {
                "label": ['form-label']
            },
            'validators':[validators.maxlength(100)]
        }),
        'added_date': fields.string({
            "label":'Date Added',
            "required":true,
            "errorAfterField":true,
            "cssClasses": {
                "label": ['form-label']
            },
            "widget": widgets.date()
        }),
        'released_date': fields.string({
            "label":'Date Released',
            "required":true,
            "errorAfterField":true,
            "cssClasses": {
                "label": ['form-label']
            },
            "widget": widgets.date()
        }),
        'category_id': fields.string({
            label:'Category',
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            widget: widgets.select(),
            choices: categories
        }),
        'content_tags': fields.string({
            label:'Tags',
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            widget: widgets.multipleSelect(),
            choices: content_tags  
        }),
        'platforms': fields.string({
            label:'Platforms',
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            widget: widgets.multipleSelect(),
            choices: platforms 
        })
           
    })
}

const create_user_reg_form = () => {
    return forms.create({
        'email': fields.string({
            label:'Email Address',
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            'validators':[validators.maxlength(200), validators.email(), validate_exist_email()]
        }),
        'display_name': fields.string({
            label:'Display Name',
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            'validators':[validators.maxlength(50), validate_exist_display_name()]
        }),
        'password': fields.password({
            label:'Password',
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            'validators':[validators.maxlength(100)]
        }),
        'confirm_password': fields.password({
            label:'Confirm Password',
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            validators: [validators.matchField('password')]
        }),
        'device_specs': fields.string({
            label:'User Device Specifications',
            required: false,
            cssClasses: {
                label: ['form-label']
            },
            "widget": widgets.textarea(),
            'validators':[validators.maxlength(600)]
        })
    })
}


const create_login_form = () => {
    return forms.create({
        'display_name_email': fields.string({
            label:"Display Name or Email",
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            }
        }),
        'password': fields.password({
            label:"Password",
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            }
        }),
    })
}



const create_search_form = (categories, content_tags, platforms) => {
    return forms.create({
        "title":fields.string({
            "label":'Title',
            "required":false,
            "cssClasses": {
                "label": ['form-label']
            }
        }),
        'company_name': fields.string({
            "label":'Company Name',
            "required":false,
            "cssClasses": {
                "label": ['form-label']
            }
        }),
        'category_id': fields.string({
            label: 'Category',
            required: false,
            cssClasses: {
                label: ['form-label']
            },
            widget: widgets.select(),
            choices: categories
        }),
        'content_tags': fields.string({
            label:'Tags',
            required:false,
            cssClasses: {
                label: ['form-label']
            },
            widget: widgets.multipleSelect(),
            choices: content_tags
        }),
        'platforms': fields.string({
            label:'Platforms',
            required:false,
            cssClasses: {
                label: ['form-label']
            },
            widget: widgets.multipleSelect(),
            choices: platforms
        })
    })
}



const create_search_order_form = () => {
    return forms.create({
        "display_name":fields.string({
            "label":'Display Name',
            "required":false,
            "cssClasses": {
                "label": ['form-label']
            }
        }),
        "status":fields.string({
            "label":'Payment Status',
            "required":false,
            "cssClasses": {
                "label": ['form-label']
            },
            widget: widgets.select(),
            choices: [[0,"-------"],[1,"unpaid"],[2,"paid"]]
        })
    })
}

const create_update_order_form = () => {
    return forms.create({
        'status': fields.string({
            label:'Update Order Status',
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            widget: widgets.select(),
            choices: [[1,"unpaid"],[2,"paid"]]
        }),

    })

}

const create_tag_form = ""

const create_category_form = ""



module.exports = { bootstrap, create_game_form, create_user_reg_form, create_login_form, create_search_form, create_search_order_form, create_update_order_form, create_tag_form, create_category_form }