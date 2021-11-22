const forms = require("forms")
const fields = forms.fields
const validators = forms.validators
const widgets = forms.widgets

var bootstrap_field = function (name, object) {
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

const create_game_form=(categories, content_tags)=>{
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
            'validators':[validators.integer()]
        }),
        'discount': fields.string({
            "label":'Discount',
            "required":true,
            "errorAfterField":true,
            "cssClasses": {
                "label": ['form-label']
            },
            'validators':[validators.integer()]
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
            "cssClasses": {
                "label": ['form-label']
            },
            'validators':[validators.maxlength(300)]
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
        'url_1': fields.string({
            "label":'Game Image 1',
            "required":false,
            "cssClasses": {
                "label": ['form-label']
            },
            'validators':[validators.maxlength(300)]
        }),
        'url_2': fields.string({
            "label":'Game Image 2',
            "required":false,
            "cssClasses": {
                "label": ['form-label']
            },
            'validators':[validators.maxlength(300)]
        }),
        'url_3': fields.string({
            "label":'Game Image 3',
            "required":false,
            "cssClasses": {
                "label": ['form-label']
            },
            'validators':[validators.maxlength(300)]
        }),
        'url_4': fields.string({
            "label":'Game Image 4',
            "required":false,
            "cssClasses": {
                "label": ['form-label']
            },
            'validators':[validators.maxlength(300)]
        }),
        'url_5': fields.string({
            "label":'Game Image 5',
            "required":false,
            "cssClasses": {
                "label": ['form-label']
            },
            'validators':[validators.maxlength(300)]
        })   
    })
}


module.exports = { bootstrap_field, create_game_form };