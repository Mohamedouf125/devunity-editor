@props([
    'name',
    'id' => null,
    'value' => null,
    'placeholder' => null,
    'uploadUrl' => null,
    'lang' => 'ar',
    'minHeight' => 300,
    'toolbar' => 'full',
    'theme' => 'light',
    'options' => [],
])

@php
    $editorId = $id ?? 'devunity_editor_' . preg_replace('/[^a-zA-Z0-9_]/', '_', $name) . '_' . bin2hex(random_bytes(4));
    $initialValue = old($name, $value ?? $slot->toHtml());
@endphp

<div class="devunity-editor-container" wire:ignore>
    <textarea
        id="{{ $editorId }}"
        name="{{ $name }}"
        @if($placeholder) placeholder="{{ $placeholder }}" @endif
        {{ $attributes->merge(['class' => 'devunity-editor-input']) }}
    >{!! htmlspecialchars($initialValue ?? '', ENT_QUOTES, 'UTF-8') !!}</textarea>
</div>

<script>
    (function() {
        const cdnScriptUrl = "https://cdn.jsdelivr.net/gh/Mohamedouf125/devunity-editor@1/dist/devunity-editor.min.js";
        const editorId = @json($editorId);

        function setupInstance() {
            if (typeof DevUnityEditor === 'undefined') {
                return setTimeout(setupInstance, 40);
            }

            const customOptions = @json($options);
            const baseOptions = {
                lang: @json($lang),
                minHeight: @json($minHeight),
                toolbar: @json($toolbar),
                theme: @json($theme),
                uploadUrl: @json($uploadUrl) || undefined,
            };

            const finalOptions = Object.assign(baseOptions, customOptions);
            const editor = new DevUnityEditor('#' + editorId, finalOptions);

            // Livewire support if present
            const textarea = document.getElementById(editorId);
            if (textarea && window.Livewire) {
                textarea.addEventListener('due:change', function(e) {
                    textarea.dispatchEvent(new Event('input', { bubbles: true }));
                });
            }
        }

        function ensureScriptLoaded(cb) {
            if (window.DevUnityEditor) {
                return cb();
            }
            let script = document.querySelector('script[src*="devunity-editor"]');
            if (!script) {
                script = document.createElement('script');
                script.src = cdnScriptUrl;
                script.async = true;
                document.head.appendChild(script);
            }
            script.addEventListener('load', cb);
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                ensureScriptLoaded(setupInstance);
            });
        } else {
            ensureScriptLoaded(setupInstance);
        }
    })();
</script>
