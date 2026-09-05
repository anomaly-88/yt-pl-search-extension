# EN:
# YouTube Playlist Search

A lightweight browser extension that adds **search, sorting, and playlist filtering controls** to YouTube and YouTube Music playlist selection dialogs.

It is especially useful for users who have a large number of playlists and want to quickly find the right one without manually scrolling through the entire list.

## Features

- Search playlists directly inside the playlist selection dialog
- Supports both:
  - YouTube
  - YouTube Music
- Instant filtering while typing
- Result counter
  - Example: `4 / 35`
- Playlist sorting:
  - A → Z
  - Z → A
  - Original order
- Numeric-aware sorting
  - `Playlist 2` comes before `Playlist 10`
- Search reset button
- Turkish character tolerant search
  - `Canakkale` can match `Çanakkale`
- Automatically detects dynamically loaded playlists
- Works with YouTube's SPA-style navigation
- Supports playlist dialogs loaded after the page itself
- Lightweight DOM observation to avoid unnecessary polling
- Designed to work with YouTube's dark interface

## Supported Websites

| Platform | Supported |
|---|---|
| YouTube | ✅ |
| YouTube Music | ✅ |

## Installation

### Chrome / Chromium-based browsers

1. Download or clone this repository.

```bash
git clone https://github.com/anomaly-88/yt-pl-search-extension.git
```

2. Open:

```text
chrome://extensions
```

3. Enable **Developer mode**.

4. Click **Load unpacked**.

5. Select the extension directory containing `manifest.json`.

The extension will automatically activate on supported YouTube pages.

## Usage

Open any video or page where YouTube allows adding content to a playlist.

Click:

**Save → Playlist**

The extension adds a toolbar above the playlist list.

You can then:

- type a playlist name to filter the list,
- see how many playlists match the current search,
- change playlist ordering,
- clear the current search instantly.

The same functionality is available in YouTube Music playlist dialogs.

## Sorting

Click the sort button to cycle between:

```text
A → Z
↓
Z → A
↓
Original Order
```

The original playlist order is preserved internally, so you can always restore YouTube's default ordering.

## Search Behavior

Search is:

- case-insensitive,
- whitespace tolerant,
- diacritic tolerant.

For example:

```text
cagri
```

can match:

```text
Çağrı
```

This also makes searching playlist names containing accented or localized characters easier.

## How It Works

The extension injects a small toolbar into YouTube's playlist selection UI.

It supports both YouTube renderer families:

```text
ytd-*
```

and YouTube Music renderer families:

```text
ytmusic-*
```

Instead of assuming that the first modal on the page is the playlist dialog, the extension detects the currently visible dialog that actually contains playlist items.

This makes it more resilient to YouTube UI changes and dynamically created dialogs.

A `MutationObserver` is used to detect:

- newly opened playlist dialogs,
- dynamically loaded playlists,
- SPA navigation changes.

DOM scans are kept limited to reduce unnecessary CPU usage.

## Project Structure

```text
.
├── manifest.json
├── content.js
├── styles.css
└── README.md
```

Depending on the version of the project, filenames may differ slightly.

## Permissions

The extension only requires permissions necessary to inject the playlist search interface into supported YouTube pages.

It does not require access to:

- your Google account credentials,
- your playlist data through the YouTube API,
- external servers.

Playlist filtering is performed locally in the browser using the DOM already rendered by YouTube.

## Privacy

This extension does not collect, store, transmit, or analyze personal data.

No external analytics, tracking services, or remote APIs are required for playlist searching.

All filtering and sorting operations happen locally in your browser.

## Compatibility

Designed primarily for Chromium-based browsers such as:

- Google Chrome
- Microsoft Edge
- Brave
- Opera

Other Chromium-based browsers may also work.

## Known Limitations

YouTube and YouTube Music are continuously updated web applications.

Because this extension interacts with their rendered interface, major DOM changes made by YouTube may temporarily affect functionality.

The extension intentionally supports multiple selector strategies to reduce the impact of these changes.

## Development

After making changes to the extension:

1. Open:

```text
chrome://extensions
```

2. Find the extension.
3. Click **Reload**.
4. Refresh the YouTube or YouTube Music page.

For DOM-related development, test both:

```text
youtube.com
music.youtube.com
```

because their playlist renderers are not identical.

## Contributing

Bug reports, selector updates, compatibility fixes, and improvements are welcome.

If YouTube changes its playlist dialog structure, please include:

- browser version,
- affected website,
- steps to reproduce,
- relevant DOM information if available.

## Disclaimer

This project is an independent browser extension and is not affiliated with, endorsed by, or sponsored by YouTube or Google.

YouTube and YouTube Music are trademarks of Google LLC.


# TR:
# YouTube Çalma Listesi Arama

YouTube ve YouTube Music çalma listesi seçim iletişim kutularına **arama, sıralama ve çalma listesi filtreleme kontrolleri** ekleyen hafif bir tarayıcı uzantısı.

Özellikle çok sayıda çalma listesine sahip olan ve tüm listeyi manuel olarak kaydırmadan doğru olanı hızlıca bulmak isteyen kullanıcılar için kullanışlıdır.

## Özellikler

- Çalma listesi seçim iletişim kutusunun içinde doğrudan çalma listesi araması yapın
- Şunları destekler:

- YouTube

- YouTube Müzik
- Yazarken anında filtreleme
- Sonuç sayacı

- Örnek: `4 / 35`
- Çalma listesi sıralaması:

- A → Z

- Z → A

- Orijinal sıra
- Sayısal karakter duyarlı sıralama

- `Çalma Listesi 2`, `Çalma Listesi 10`'dan önce gelir
- Arama sıfırlama düğmesi
- Türkçe karakterlere duyarlı arama

- `Çanakkale`, `Çanakkale` ile eşleşebilir
- Dinamik olarak yüklenen çalma listelerini otomatik olarak algılar
- YouTube'un SPA tarzı navigasyonuyla çalışır
- Sayfanın kendisinden sonra yüklenen çalma listesi iletişim kutularını destekler
- Gereksiz sorgulamayı önlemek için hafif DOM gözlemi
- YouTube'un karanlık arayüzüyle çalışacak şekilde tasarlanmıştır

## Desteklenen Web Siteleri

| Platform | Desteklenen |

|---|---|

| YouTube | ✅ |

| YouTube Müzik | ✅ |

## Kurulum

### Chrome / Chromium tabanlı tarayıcılar

1. Bu depoyu indirin veya klonlayın.

```bash
git clone https://github.com/anomaly-88/yt-pl-search-extension.git
```

2. Açın:

```text
chrome://extensions
```

3. **Geliştirici modunu** etkinleştirin.

4. **Paketlenmemiş olanı yükle** seçeneğine tıklayın.

5. `manifest.json` dosyasını içeren uzantı dizinini seçin.

Uzantı, desteklenen YouTube sayfalarında otomatik olarak etkinleşecektir.

## Kullanım

YouTube'un oynatma listesine içerik eklemeye izin verdiği herhangi bir video veya sayfayı açın.

Tıklayın:

**Kaydet → Oynatma Listesi**

Uzantı, oynatma listesi listesinin üstüne bir araç çubuğu ekler.

Ardından şunları yapabilirsiniz:

- Listeyi filtrelemek için bir çalma listesi adı yazın,
- Mevcut aramaya uyan kaç çalma listesi olduğunu görün,
- Çalma listesi sıralamasını değiştirin,
- Mevcut aramayı anında temizleyin.

Aynı işlevsellik YouTube Music çalma listesi iletişim kutularında da mevcuttur.

## Sıralama

Sıralama düğmesine tıklayarak şunlar arasında geçiş yapabilirsiniz:

```metin
A → Z
↓
Z → A
↓
Orijinal Sıralama
```

Orijinal çalma listesi sıralaması dahili olarak korunur, böylece her zaman YouTube'un varsayılan sıralamasını geri yükleyebilirsiniz.

## Arama Davranışı

Arama:

- büyük/küçük harf duyarsızdır,
- boşluklara toleranslıdır,
- aksan işaretlerine toleranslıdır.

Örneğin:

```metin
cagri
```
şuna eşleşebilir:

```metin
Çağrı
```

Bu, aksanlı veya yerelleştirilmiş karakterler içeren çalma listesi adlarında aramayı da kolaylaştırır.

## Nasıl Çalışır

Bu eklenti, YouTube'un oynatma listesi seçim arayüzüne küçük bir araç çubuğu ekler.

Hem YouTube renderer ailelerini destekler:

```metin
ytd-*
```

hem de YouTube Music renderer ailelerini:

```metin
ytmusic-*
```

Sayfadaki ilk modal pencerenin oynatma listesi iletişim kutusu olduğunu varsaymak yerine, eklenti aslında oynatma listesi öğeleri içeren şu anda görünür olan iletişim kutusunu algılar.

Bu, YouTube arayüzü değişikliklerine ve dinamik olarak oluşturulan iletişim kutularına karşı daha dayanıklı olmasını sağlar.

Bir `MutationObserver`, şunları algılamak için kullanılır:

- yeni açılan oynatma listesi iletişim kutuları,
- dinamik olarak yüklenen oynatma listeleri,
- SPA gezinme değişiklikleri.

Gereksiz CPU kullanımını azaltmak için DOM taramaları sınırlı tutulur.

## Proje Yapısı

```metin
.

├── manifest.json
├── content.js
├── styles.css
└── README.md
```

Projenin sürümüne bağlı olarak dosya adları biraz farklılık gösterebilir.

## İzinler

Bu eklenti, yalnızca desteklenen YouTube sayfalarına oynatma listesi arama arayüzünü eklemek için gerekli izinleri gerektirir.

Şunlara erişim gerektirmez:

- Google hesabınızın kimlik bilgileri,
- YouTube API aracılığıyla oynatma listesi verileriniz,
- harici sunucular.

Oynatma listesi filtreleme, YouTube tarafından zaten oluşturulmuş DOM kullanılarak tarayıcıda yerel olarak gerçekleştirilir.

## Gizlilik

Bu eklenti kişisel verileri toplamaz, saklamaz, iletmez veya analiz etmez.

Oynatma listesi araması için harici analiz, izleme hizmetleri veya uzaktan API'ler gerekmez.

Tüm filtreleme ve sıralama işlemleri tarayıcınızda yerel olarak gerçekleşir.

## Uyumluluk

Öncelikle şu Chromium tabanlı tarayıcılar için tasarlanmıştır:

- Google Chrome
- Microsoft Edge
- Brave
- Opera

Diğer Chromium tabanlı tarayıcılar da çalışabilir.

## Bilinen Sınırlamalar

YouTube ve YouTube Music sürekli güncellenen web uygulamalarıdır.

Bu uzantı, oluşturulan arayüzleriyle etkileşimde bulunduğundan, YouTube tarafından yapılan büyük DOM değişiklikleri işlevselliği geçici olarak etkileyebilir.

Uzantı, bu değişikliklerin etkisini azaltmak için kasıtlı olarak birden fazla seçici stratejisini destekler.

## Geliştirme

Uzantıda değişiklik yaptıktan sonra:

1. Açın:

```text
chrome://extensions
```

2. Uzantıyı bulun.

3. **Yeniden Yükle**'ye tıklayın.

4. YouTube veya YouTube Music sayfasını yenileyin.

DOM ile ilgili geliştirme için, her ikisini de test edin:

```text
youtube.com
music.youtube.com
```

çünkü oynatma listesi oluşturucuları aynı değildir.

## Katkıda Bulunma

Hata raporları, seçici güncellemeleri, uyumluluk düzeltmeleri ve iyileştirmeler memnuniyetle karşılanır.

YouTube oynatma listesi iletişim kutusu yapısını değiştirirse lütfen şunları ekleyin:

- tarayıcı sürümü,
- etkilenen web sitesi,
- yeniden oluşturma adımları,
- varsa ilgili DOM bilgileri.

## Yasal Uyarı

Bu proje bağımsız bir tarayıcı uzantısıdır ve YouTube veya Google ile bağlantılı değildir, onlar tarafından desteklenmemektedir veya sponsorluğunu üstlenmemektedir.

YouTube ve YouTube Music, Google LLC'nin ticari markalarıdır.

## License

TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATIONPersonal Use and Modification:You are free to download, install, study, and modify the source code of this Chrome Extension for your personal, non-commercial use only.Non-Commercial Restriction:You may not use this material, its source code, or any modified versions of it for commercial purposes. Commercial purposes include, but are not limited to:Selling the extension on the Chrome Web Store or any other marketplace.Charging users for downloading, installing, or using the extension.Monitizing the extension via advertisements, tracking, data sale, or premium paid features.Using the software or its parts in a commercial product or service within a business environment.Distribution:If you redistribute or share the source code (modified or unmodified), you must retain this license file and give appropriate credit to the original author.Warranty:THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY.Copyright (c) 2026 [Aykan Akduman]
