function createStartUp() {
  var self = {}
  var sourceEl;

  function init() {
    render()
    connect()
  }

  function createPBS(projectIn, name) {
    var projectIn = projectIn || "REF-001, "
    var projectName = name || "New Project"
    var store = app.store.projects[0]//TODO remove
    store.name = projectName
    app.store.projects[0].name = projectName
    store.reference = projectIn
    store.currentPbs.items.push({name: projectIn+projectName, uuid: "ita2215151-a50f-4dd3-904e-146118d5d444"})
    store.currentPbs.items.push({name: "Sub Category A", uuid:"it23bb697b-9418-4671-bf4b-5410af03dfc3"})
    store.currentPbs.items.push({name: "Sub Category B", uuid:"it9ba7cc64-970a-4846-b9af-560d8125623e"})
    store.currentPbs.links.push({source: "ita2215151-a50f-4dd3-904e-146118d5d444", target:"it23bb697b-9418-4671-bf4b-5410af03dfc3"})
    store.currentPbs.links.push({source: "ita2215151-a50f-4dd3-904e-146118d5d444", target:"it9ba7cc64-970a-4846-b9af-560d8125623e"})
  }

  function connect() {
    let file, url, reader = new FileReader;

    sourceEl.onclick = function(event) {
        if (event.target.classList.contains("action_startup_submit_item")) {
          console.log(event.target);
          console.log(document.querySelector('.input-su-name').value);
          createPBS(document.querySelector('.input-su-in').value, document.querySelector('.input-su-name').value)
          //renderCDC(store.db, "")
          pageManager.setActivePage("unified")
          renderCDC() //TODO change update mecanism
          sourceEl.remove()
        }
        if (event.target.classList.contains("action_startup_reload_item")) {
          console.log(event.target);
          localforage.getItem('sessionProjects').then(function(value) {
              app.store.projects = value;
              pageManager.setActivePage("unified")
              renderCDC() //TODO change update mecanism
              sourceEl.remove()
          }).catch(function(err) {
              // This code runs if there were any errors
              console.log(err);
          });
        }
        if (event.target.classList.contains("action_startup_load_reveal")) {
          function readJSON(e) {
            reader.readAsText(document.querySelector(".statup_input").files[0]);
          }
          document.querySelector(".statup_input_zone").style.visibility = "visible"
          document.querySelector(".statup_input").addEventListener("change", readJSON);
          reader.addEventListener("load", function() {
            console.log(reader.result);
            // var textContent = JSON.stringify(reader.result, null, 2);
            var jsonContent = JSON.parse(reader.result);
            console.log(jsonContent);
            app.store.projects = jsonContent
            pageManager.setActivePage("unified")
            renderCDC() //TODO change update mecanism
            sourceEl.remove()
          });
        }
    }
  }

  function render() {
    renderHTML()
  }
  function renderHTML() {

    sourceEl = document.createElement('div');
    document.querySelector('body').appendChild(sourceEl);
    var dimmer = document.createElement('div');
    dimmer.classList="dimmer"
    dimmer.style.background = "linear-gradient(to bottom, #bbd2c5, #536976)"
    dimmer.style.opacity = 1;
    var mainEl = document.createElement('div');

    mainEl.classList ="ui raised very padded text container segment"
    mainEl.style.position = "fixed"
    mainEl.style.top = "0px"
    mainEl.style.width = "50%"
    //mainEl.style.height = "100%"
    mainEl.style.zIndex = "99999"
    mainEl.style.backgroundColor = "white"
    //mainEl.style.margin = "auto"
    mainEl.style.left= "25%";
    // mainEl.style.top= "50%";
    // mainEl.style.transform= "translate(-50%, -50%);"

    sourceEl.appendChild(dimmer)
    sourceEl.appendChild(mainEl)
    mainEl.innerHTML = `
    <div class="ui container">
      <h2 class='ui center aligned icon header'>
        <i class="circular building outline icon"></i>
        <div class="ui content">
        Kraken
        </div>
      </h2>
      <div class="ui center aligned container">
        <button class="ui center aligned big teal button action_startup_reload_item">Reload last session</button>
      </div>
    </div>
    <div class="ui horizontal divider">or</div>
    <div class="ui form">
      <div class="field">
        <label>Reference Number</label>
        <input class="input-su-in" type="text" name="IN" placeholder="REF-0000">
      </div>
      <div class="field">
        <label>Project Name</label>
        <input class="input-su-name" type="text" name="project-name" placeholder="Nom">
      </div>
      <div class="field">
        <div class="ui checkbox">
          <input type="checkbox" tabindex="0" class="hidden">
          <label>I agree to the Terms and Conditions</label>
        </div>
      </div>
      <button class="ui button action_startup_submit_item" type="submit">Confirm</button>
      <button class="ui basic tiny button action_startup_load_reveal" type="submit">or load a file</button>
      <div style="visibility:hidden" class="statup_input_zone">
        <input class="ui input statup_input" type="file" accept=".json" />
      </div>
    </div>
    `

    document.querySelector('.app-loader-cache').remove();

  }
  self.init = init
  return self
}

var startUp = createStartUp().init()