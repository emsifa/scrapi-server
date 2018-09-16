var app = new Vue({
  el: '#app',
  data: {
    endpoint: '/scrape',
    url: '',
    data: '',
    examples: [],
    errors: {},
    editor: null,
    submitting: false,
    result: null
  },
  mounted() {
    this.$refs.url.focus()

    this.editor = CodeMirror.fromTextArea(this.$refs.dataEditor, {
      lineNumbers: true,
      theme: 'neo',
      autoCloseBrackets: true,
      tabSize: 2,
    })
    this.editor.addKeyMap({
      'Ctrl-Enter': () => this.submit()
    });
    this.editor.on('change', () => this.data = this.editor.getValue())

    const data = this.load()
    this.url = data.url
    this.data = data.data
    this.editor.setValue(data.data)
  },
  methods: {
    submit () {
      this.result = null
      this.submitting = true

      const data = { url: this.url, data: this.data }
      this.save(data)

      this.validate(data)
        .then(data => axios.post(this.endpoint, data))
        .then(res => this.result = res.data)
        .then(_ => this.submitting = false)
        .catch(err => {
          this.submitting = false
          if (err.response) {
            this.result = err.response.data
          }

          if (this.errors) {
            Vue.nextTick(_ => {
              if (this.errors.url) {
                this.$refs.url.focus()
              } else if (this.errors.data) {
                this.editor.focus()
              }
            })
          }
        })
    },
    validate (data) {
      const errors = {}
      // validate URL
      if (!data.url.trim()) {
        errors.url = 'URL cannot be empty'
      } else if (!data.url.match(/^https?\:\/\//)) {
        errors.url = 'URL is not valid URL'
      }

      // validate Data
      if (!data.data.trim()) {
        errors.data = 'Data cannot be empty'
      } else {
        try {
          data.data = JSON.parse(data.data.trim())
        } catch (e) {
          errors.data = 'Data is not valid JSON:' + e.message.split(':').pop()
        }
      }

      this.errors = errors
      if (Object.keys(errors).length) {
        return Promise.reject(new Error('Validation Error'))
      } else {
        return Promise.resolve(data)
      }
    },
    save ({url, data}) {
      localStorage.setItem('data', JSON.stringify({url, data}))
    },
    load () {
      const defaults = { url: '', data: '' }
      const data = localStorage.getItem('data')
      if (data) {
        try {
          return {...defaults, ...JSON.parse(data)}
        } catch(e) {
          return defaults
        }
      } else {
        return defaults
      }
    }
  }
})
