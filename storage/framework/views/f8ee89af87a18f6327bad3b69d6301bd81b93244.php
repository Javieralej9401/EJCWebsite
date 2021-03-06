  <!-- Search bar -->
    <div class="section">
        <nav>
          <div class="nav-wrapper <?php echo e(isset($demoColors['mainColorClass']) ? $demoColors['mainColorClass'] : ''); ?> <?php echo e(isset($demoColors['secondFontColorClass']) ? $demoColors['secondFontColorClass'] : ''); ?> accent-2">
            <form>
              <div class="input-field">
                <input id="search" type="search" required >
                <label for="search"><i class="material-icons">search</i></label>
                <i class="material-icons">close</i>
              </div>
            </form>
          </div>
        </nav>
     </div>

     <div class="section">
        <div class="row">
          <div class="col s12 m12">
            <div class="card-panel transparent">
              <span class="text-grey text-darken-3"><?php echo e(trans('core::main.menuProductCardMessage1')); ?> 
              </span>
            </div>
          </div>

          <div class="col s12 m12">
              <ul class="collapsible" data-collapsible="accordion">
                <li>
                  <div class="collapsible-header"><i class="material-icons">label_outline</i><?php echo e(trans('core::main.category')); ?> 1</div>
                  <div class="collapsible-body"><p><?php echo e(trans('core::main.category')); ?> 1</p></div>
                </li>
                <li>
                  <div class="collapsible-header"><i class="material-icons">label_outline</i><?php echo e(trans('core::main.category')); ?> 2</div>
                  <div class="collapsible-body"><p><?php echo e(trans('core::main.category')); ?> 2</p></div>
                </li>
                <li>
                  <div class="collapsible-header"><i class="material-icons">label_outline</i><?php echo e(trans('core::main.category')); ?> 3</div>
                  <div class="collapsible-body"><p><?php echo e(trans('core::main.category')); ?> 3</p></div>
                </li>
              </ul>
          </div>
        </div>
     </div>