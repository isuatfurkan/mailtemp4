import React, { useState, useEffect, useCallback } from 'react';
import {
  Mail,
  Copy,
  RefreshCw,
  Clock,
  Search,
  Filter,
  Trash2,
  Archive,
  Star,
  MoreHorizontal,
  Settings,
  Sun,
  Moon,
  Globe,
  ChevronDown,
  Plus,
  X,
  Check,
  AlertCircle,
  Shield,
  Zap,
  Users,
  Code,
  ShoppingCart,
  Eye,
  EyeOff,
  Forward,
  Folder,
  Tag,
  Bell,
  Menu,
  Home,
  BookOpen,
  MessageSquare,
  Send
} from 'lucide-react';

// Tipler ve Arayüzler
interface Email {
  id: string;
  from: string;
  subject: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
  isStarred: boolean;
  labels: string[];
  isDeleted: boolean;
}

interface TempEmail {
  id: string;
  address: string;
  expiresAt: Date;
  emails: Email[];
  isActive: boolean;
}

interface Language {
  code: string;
  name: string;
  flag: string;
  locale: string;
}

interface Feedback {
    text: string;
    date: Date;
}

type Theme = 'light' | 'dark';
type Page = 'home' | 'useCases' | 'blog';

// Çeviri sistemi
const translations = {
  en: {
    home: 'Home', useCases: 'Use Cases', blog: 'Blog', tempEmail: 'Temporary Email', generateEmail: 'Generate New Email', copyEmail: 'Copy Email', copied: 'Copied!', expiresIn: 'Expires in', extendExpiration: 'Extend Expiration', newEmail: 'New Email', customizeEmail: 'Customize Email', chooseDomain: 'Choose Domain', setExpiration: 'Set Expiration', inbox: 'Inbox', noEmails: 'No emails yet', searchEmails: 'Search emails...', addMailbox: 'Add Mailbox', whyUseTempEmail: 'Why Use Temporary Email?', useCasesIntro: 'Discover the various ways temporary email addresses can protect your privacy and improve your online experience.', blogTitle: 'Latest Articles', blogIntro: 'Stay informed about email privacy, security tips, and the latest updates in temporary email technology.', readMore: 'Read More', popularTopics: 'Popular Topics', privacyPolicy: 'Privacy Policy', dataNotStored: 'Your data is never stored permanently. All temporary emails are automatically deleted after expiration.', feedback: 'Feedback', sendFeedback: 'Send Feedback', feedbackPlaceholder: 'Share your thoughts and suggestions...', thankYou: 'Thank you for your feedback!', usernamePlaceholder: 'username', adSlotText: 'Ad Slot', expired: 'Expired', viewFeedback: 'View Feedback', submittedFeedback: 'Submitted Feedback', noFeedbackYet: 'No feedback yet.',
    expirationOptions: [ { label: '10 minutes' }, { label: '30 minutes' }, { label: '1 hour' }, { label: '6 hours' }, { label: '1 day' }, { label: '1 week' } ],
    useCasesContent: [ { title: 'Online Shopping', description: 'Protect your primary email from promotional spam when shopping online.' }, { title: 'Application Testing', description: 'Test user registration flows without cluttering your main inbox.' }, { title: 'Avoid Spam', description: 'Keep your main email clean by using temporary addresses for signups.' }, { title: 'Privacy Protection', description: 'Maintain anonymity when accessing services that require email verification.' }, { title: 'Developer Testing', description: 'Test email functionality in your applications safely.' }, { title: 'Social Media Accounts', description: 'Create temporary social media accounts without exposing your real email.' } ],
    blogPostsContent: [ { title: 'The Ultimate Guide to Email Privacy in 2025', excerpt: 'Learn how to protect your email privacy and avoid spam with temporary email addresses.' }, { title: '10 Security Tips for Online Shopping', excerpt: 'Stay safe while shopping online with these essential security practices.' }, { title: 'How Developers Use Temporary Emails for Testing', excerpt: 'Discover why temporary emails are essential tools for application developers.' } ],
    popularTopicsList: ['Email Privacy', 'Online Security', 'Developer Tools', 'Anti-Spam', 'Digital Identity']
  },
  tr: {
    home: 'Ana Sayfa', useCases: 'Kullanım Alanları', blog: 'Blog', tempEmail: 'Geçici E-posta', generateEmail: 'Yeni E-posta Oluştur', copyEmail: 'E-postayı Kopyala', copied: 'Kopyalandı!', expiresIn: 'Kalan süre', extendExpiration: 'Süreyi Uzat', newEmail: 'Yeni E-posta', customizeEmail: 'E-postayı Özelleştir', chooseDomain: 'Alan Adı Seç', setExpiration: 'Geçerlilik Süresini Ayarla', inbox: 'Gelen Kutusu', noEmails: 'Henüz e-posta yok', searchEmails: 'E-posta ara...', addMailbox: 'Posta Kutusu Ekle', whyUseTempEmail: 'Neden Geçici E-posta Kullanmalı?', useCasesIntro: 'Geçici e-posta adreslerinin gizliliğinizi nasıl koruduğunu ve çevrimiçi deneyiminizi nasıl iyileştirdiğini keşfedin.', blogTitle: 'Son Makaleler', blogIntro: 'E-posta gizliliği, güvenlik ipuçları ve geçici e-posta teknolojisindeki en son güncellemeler hakkında bilgi sahibi olun.', readMore: 'Devamını Oku', popularTopics: 'Popüler Konular', privacyPolicy: 'Gizlilik Politikası', dataNotStored: 'Verileriniz asla kalıcı olarak saklanmaz. Tüm geçici e-postalar, süreleri dolduktan sonra otomatik olarak silinir.', feedback: 'Geri Bildirim', sendFeedback: 'Geri Bildirim Gönder', feedbackPlaceholder: 'Düşüncelerinizi ve önerilerinizi paylaşın...', thankYou: 'Geri bildiriminiz için teşekkürler!', usernamePlaceholder: 'kullanıcıadı', adSlotText: '[Reklam Alanı]', expired: 'Süresi Doldu', viewFeedback: 'Geri Bildirimleri Görüntüle', submittedFeedback: 'Gönderilen Geri Bildirimler', noFeedbackYet: 'Henüz geri bildirim yok.',
    expirationOptions: [ { label: '10 dakika' }, { label: '30 dakika' }, { label: '1 saat' }, { label: '6 saat' }, { label: '1 gün' }, { label: '1 hafta' } ],
    useCasesContent: [ { title: 'Online Alışveriş', description: 'Online alışveriş yaparken ana e-postanızı promosyonel spamlerden koruyun.' }, { title: 'Uygulama Testi', description: 'Ana gelen kutunuzu doldurmadan kullanıcı kayıt akışlarını test edin.' }, { title: 'Spamden Kaçının', description: 'Kayıtlar için geçici adresler kullanarak ana e-postanızı temiz tutun.' }, { title: 'Gizlilik Koruması', description: 'E-posta doğrulaması gerektiren hizmetlere erişirken anonimliğinizi koruyun.' }, { title: 'Geliştirici Testleri', description: 'Uygulamalarınızdaki e-posta işlevselliğini güvenle test edin.' }, { title: 'Sosyal Medya Hesapları', description: 'Gerçek e-postanızı ifşa etmeden geçici sosyal medya hesapları oluşturun.' } ],
    blogPostsContent: [ { title: '2025\'te E-posta Gizliliği İçin Nihai Rehber', excerpt: 'Geçici e-posta adresleriyle e-posta gizliliğinizi nasıl koruyacağınızı ve spam\'den nasıl kaçınacağınızı öğrenin.' }, { title: 'Online Alışveriş İçin 10 Güvenlik İpucu', excerpt: 'Bu temel güvenlik uygulamalarıyla online alışveriş yaparken güvende kalın.' }, { title: 'Geliştiriciler Test İçin Geçici E-postaları Nasıl Kullanır?', excerpt: 'Geçici e-postaların neden uygulama geliştiricileri için temel araçlar olduğunu keşfedin.' } ],
    popularTopicsList: ['E-posta Gizliliği', 'Çevrimiçi Güvenlik', 'Geliştirici Araçları', 'Anti-Spam', 'Dijital Kimlik']
  },
  es: {
    home: 'Inicio', useCases: 'Casos de Uso', blog: 'Blog', tempEmail: 'Email Temporal', generateEmail: 'Generar Nuevo Email', copyEmail: 'Copiar Email', copied: '¡Copiado!', expiresIn: 'Expira en', extendExpiration: 'Extender Expiración', newEmail: 'Nuevo Email', customizeEmail: 'Personalizar Email', chooseDomain: 'Elegir Dominio', setExpiration: 'Establecer Expiración', inbox: 'Bandeja de Entrada', noEmails: 'No hay emails aún', searchEmails: 'Buscar emails...', addMailbox: 'Añadir Buzón', whyUseTempEmail: '¿Por Qué Usar Email Temporal?', useCasesIntro: 'Descubra las diversas formas en que las direcciones de correo electrónico temporales pueden proteger su privacidad y mejorar su experiencia en línea.', blogTitle: 'Últimos Artículos', blogIntro: 'Manténgase informado sobre la privacidad del correo electrónico, consejos de seguridad y las últimas actualizaciones en tecnología de correo electrónico temporal.', readMore: 'Leer Más', popularTopics: 'Temas Populares', privacyPolicy: 'Política de Privacidad', dataNotStored: 'Tus datos nunca se almacenan permanentemente. Todos los emails temporales se eliminan automáticamente después de la expiración.', feedback: 'Comentarios', sendFeedback: 'Enviar Comentarios', feedbackPlaceholder: 'Comparte tus pensamientos y sugerencias...', thankYou: '¡Gracias por tus comentarios!', usernamePlaceholder: 'nombredeusuario', adSlotText: 'Espacio Publicitario', expired: 'Expirado', viewFeedback: 'Ver Comentarios', submittedFeedback: 'Comentarios Enviados', noFeedbackYet: 'Aún no hay comentarios.',
    expirationOptions: [ { label: '10 minutos' }, { label: '30 minutos' }, { label: '1 hora' }, { label: '6 horas' }, { label: '1 día' }, { label: '1 semana' } ],
    useCasesContent: [ { title: 'Compras en Línea', description: 'Proteja su correo electrónico principal del spam promocional cuando compre en línea.' }, { title: 'Pruebas de Aplicaciones', description: 'Pruebe los flujos de registro de usuarios sin saturar su bandeja de entrada principal.' }, { title: 'Evitar Spam', description: 'Mantenga limpio su correo electrónico principal utilizando direcciones temporales para los registros.' }, { title: 'Protección de la Privacidad', description: 'Mantenga el anonimato al acceder a servicios que requieren verificación por correo electrónico.' }, { title: 'Pruebas de Desarrolladores', description: 'Pruebe la funcionalidad del correo electrónico en sus aplicaciones de forma segura.' }, { title: 'Cuentas de Redes Sociales', description: 'Cree cuentas de redes sociales temporales sin exponer su correo electrónico real.' } ],
    blogPostsContent: [ { title: 'La Guía Definitiva sobre la Privacidad del Correo Electrónico en 2025', excerpt: 'Aprenda a proteger la privacidad de su correo electrónico y a evitar el spam con direcciones de correo electrónico temporales.' }, { title: '10 Consejos de Seguridad para las Compras en Línea', excerpt: 'Manténgase seguro mientras compra en línea con estas prácticas de seguridad esenciales.' }, { title: 'Cómo los Desarrolladores Usan los Correos Electrónicos Temporales para las Pruebas', excerpt: 'Descubra por qué los correos electrónicos temporales son herramientas esenciales para los desarrolladores de aplicaciones.' } ],
    popularTopicsList: ['Privacidad del Email', 'Seguridad en Línea', 'Herramientas para Desarrolladores', 'Anti-Spam', 'Identidad Digital']
  },
  fr: {
    home: 'Accueil', useCases: 'Cas d\'Usage', blog: 'Blog', tempEmail: 'E-mail Temporaire', generateEmail: 'Générer un nouvel e-mail', copyEmail: 'Copier l\'e-mail', copied: 'Copié !', expiresIn: 'Expire dans', extendExpiration: 'Prolonger l\'expiration', newEmail: 'Nouvel e-mail', customizeEmail: 'Personnaliser l\'e-mail', chooseDomain: 'Choisir un domaine', setExpiration: 'Définir l\'expiration', inbox: 'Boîte de réception', noEmails: 'Aucun e-mail pour le moment', searchEmails: 'Rechercher des e-mails...', addMailbox: 'Ajouter une boîte', whyUseTempEmail: 'Pourquoi utiliser un e-mail temporaire ?', useCasesIntro: 'Découvrez les différentes façons dont les adresses e-mail temporaires peuvent protéger votre vie privée et améliorer votre expérience en ligne.', blogTitle: 'Derniers Articles', blogIntro: 'Restez informé sur la confidentialité des e-mails, les conseils de sécurité et les dernières mises à jour de la technologie des e-mails temporaires.', readMore: 'Lire la suite', popularTopics: 'Sujets Populaires', privacyPolicy: 'Politique de Confidentialité', dataNotStored: 'Vos données ne sont jamais stockées de façon permanente. Tous les e-mails temporaires sont automatiquement supprimés après leur expiration.', feedback: 'Commentaires', sendFeedback: 'Envoyer des commentaires', feedbackPlaceholder: 'Partagez vos réflexions et suggestions...', thankYou: 'Merci pour vos commentaires !', usernamePlaceholder: 'nomdutilisateur', adSlotText: 'Espace Publicitaire', expired: 'Expiré', viewFeedback: 'Voir les Commentaires', submittedFeedback: 'Commentaires Soumis', noFeedbackYet: 'Aucun commentaire pour le moment.',
    expirationOptions: [ { label: '10 minutes' }, { label: '30 minutes' }, { label: '1 heure' }, { label: '6 heures' }, { label: '1 jour' }, { label: '1 semaine' } ],
    useCasesContent: [ { title: 'Achats en Ligne', description: 'Protégez votre e-mail principal des spams promotionnels lors de vos achats en ligne.' }, { title: 'Test d\'Applications', description: 'Testez les flux d\'inscription des utilisateurs sans encombrer votre boîte de réception principale.' }, { title: 'Éviter le Spam', description: 'Gardez votre e-mail principal propre en utilisant des adresses temporaires pour les inscriptions.' }, { title: 'Protection de la Vie Privée', description: 'Conservez l\'anonymat lorsque vous accédez à des services nécessitant une vérification par e-mail.' }, { title: 'Tests pour Développeurs', description: 'Testez en toute sécurité la fonctionnalité de messagerie dans vos applications.' }, { title: 'Comptes de Réseaux Sociaux', description: 'Créez des comptes de réseaux sociaux temporaires sans exposer votre véritable e-mail.' } ],
    blogPostsContent: [ { title: 'Le Guide Ultime de la Confidentialité des E-mails en 2025', excerpt: 'Apprenez à protéger la confidentialité de vos e-mails et à éviter le spam avec des adresses e-mail temporaires.' }, { title: '10 Conseils de Sécurité pour les Achats en Ligne', excerpt: 'Restez en sécurité lors de vos achats en ligne grâce à ces pratiques de sécurité essentielles.' }, { title: 'Comment les Développeurs Utilisent les E-mails Temporaires pour les Tests', excerpt: 'Découvrez pourquoi les e-mails temporaires sont des outils essentiels pour les développeurs d\'applications.' } ],
    popularTopicsList: ['Confidentialité E-mail', 'Sécurité en Ligne', 'Outils Développeur', 'Anti-Spam', 'Identité Numérique']
  },
  de: {
    home: 'Startseite', useCases: 'Anwendungsfälle', blog: 'Blog', tempEmail: 'Temporäre E-Mail', generateEmail: 'Neue E-Mail erstellen', copyEmail: 'E-Mail kopieren', copied: 'Kopiert!', expiresIn: 'Läuft ab in', extendExpiration: 'Ablaufzeit verlängern', newEmail: 'Neue E-Mail', customizeEmail: 'E-Mail anpassen', chooseDomain: 'Domain wählen', setExpiration: 'Ablaufzeit festlegen', inbox: 'Posteingang', noEmails: 'Noch keine E-Mails', searchEmails: 'E-Mails suchen...', addMailbox: 'Postfach hinzufügen', whyUseTempEmail: 'Warum eine temporäre E-Mail verwenden?', useCasesIntro: 'Entdecken Sie die vielfältigen Möglichkeiten, wie temporäre E-Mail-Adressen Ihre Privatsphäre schützen und Ihr Online-Erlebnis verbessern können.', blogTitle: 'Neueste Artikel', blogIntro: 'Bleiben Sie über E-Mail-Datenschutz, Sicherheitstipps und die neuesten Updates in der Technologie für temporäre E-Mails informiert.', readMore: 'Weiterlesen', popularTopics: 'Beliebte Themen', privacyPolicy: 'Datenschutzrichtlinie', dataNotStored: 'Ihre Daten werden niemals dauerhaft gespeichert. Alle temporären E-Mails werden nach Ablauf automatisch gelöscht.', feedback: 'Feedback', sendFeedback: 'Feedback senden', feedbackPlaceholder: 'Teilen Sie Ihre Gedanken und Vorschläge...', thankYou: 'Vielen Dank für Ihr Feedback!', usernamePlaceholder: 'benutzername', adSlotText: 'Werbefläche', expired: 'Abgelaufen', viewFeedback: 'Feedback Anzeigen', submittedFeedback: 'Gesendetes Feedback', noFeedbackYet: 'Noch kein Feedback.',
    expirationOptions: [ { label: '10 Minuten' }, { label: '30 Minuten' }, { label: '1 Stunde' }, { label: '6 Stunden' }, { label: '1 Tag' }, { label: '1 Woche' } ],
    useCasesContent: [ { title: 'Online-Shopping', description: 'Schützen Sie Ihre primäre E-Mail-Adresse vor Werbe-Spam beim Online-Shopping.' }, { title: 'Anwendungstests', description: 'Testen Sie Benutzerregistrierungsabläufe, ohne Ihren Haupt-Posteingang zu überladen.' }, { title: 'Spam vermeiden', description: 'Halten Sie Ihre Haupt-E-Mail sauber, indem Sie temporäre Adressen für Anmeldungen verwenden.' }, { title: 'Datenschutz', description: 'Wahren Sie Ihre Anonymität bei Diensten, die eine E-Mail-Verifizierung erfordern.' }, { title: 'Entwicklertests', description: 'Testen Sie die E-Mail-Funktionalität in Ihren Anwendungen sicher.' }, { title: 'Social-Media-Konten', description: 'Erstellen Sie temporäre Social-Media-Konten, ohne Ihre echte E-Mail preiszugeben.' } ],
    blogPostsContent: [ { title: 'Der ultimative Leitfaden zum E-Mail-Datenschutz im Jahr 2025', excerpt: 'Erfahren Sie, wie Sie Ihren E-Mail-Datenschutz schützen und Spam mit temporären E-Mail-Adressen vermeiden können.' }, { title: '10 Sicherheitstipps für das Online-Shopping', excerpt: 'Bleiben Sie beim Online-Shopping mit diesen wesentlichen Sicherheitspraktiken sicher.' }, { title: 'Wie Entwickler temporäre E-Mails zum Testen verwenden', excerpt: 'Entdecken Sie, warum temporäre E-Mails unverzichtbare Werkzeuge für Anwendungsentwickler sind.' } ],
    popularTopicsList: ['E-Mail-Datenschutz', 'Online-Sicherheit', 'Entwickler-Tools', 'Anti-Spam', 'Digitale Identität']
  },
  it: {
    home: 'Home', useCases: 'Casi d\'Uso', blog: 'Blog', tempEmail: 'Email Temporanea', generateEmail: 'Genera Nuova Email', copyEmail: 'Copia Email', copied: 'Copiato!', expiresIn: 'Scade tra', extendExpiration: 'Estendi Scadenza', newEmail: 'Nuova Email', customizeEmail: 'Personalizza Email', chooseDomain: 'Scegli Dominio', setExpiration: 'Imposta Scadenza', inbox: 'Posta in Arrivo', noEmails: 'Nessuna email ancora', searchEmails: 'Cerca email...', addMailbox: 'Aggiungi Casella', whyUseTempEmail: 'Perché usare un\'email temporanea?', useCasesIntro: 'Scopri i vari modi in cui gli indirizzi email temporanei possono proteggere la tua privacy e migliorare la tua esperienza online.', blogTitle: 'Ultimi Articoli', blogIntro: 'Rimani informato sulla privacy delle email, consigli sulla sicurezza e gli ultimi aggiornamenti sulla tecnologia delle email temporanee.', readMore: 'Leggi di più', popularTopics: 'Argomenti Popolari', privacyPolicy: 'Informativa sulla Privacy', dataNotStored: 'I tuoi dati non vengono mai memorizzati in modo permanente. Tutte le email temporanee vengono eliminate automaticamente dopo la scadenza.', feedback: 'Feedback', sendFeedback: 'Invia Feedback', feedbackPlaceholder: 'Condividi i tuoi pensieri e suggerimenti...', thankYou: 'Grazie per il tuo feedback!', usernamePlaceholder: 'nomeutente', adSlotText: 'Spazio Pubblicitario', expired: 'Scaduto', viewFeedback: 'Visualizza Feedback', submittedFeedback: 'Feedback Inviato', noFeedbackYet: 'Nessun feedback ancora.',
    expirationOptions: [ { label: '10 minuti' }, { label: '30 minuti' }, { label: '1 ora' }, { label: '6 ore' }, { label: '1 giorno' }, { label: '1 settimana' } ],
    useCasesContent: [ { title: 'Shopping Online', description: 'Proteggi la tua email principale dallo spam promozionale quando fai acquisti online.' }, { title: 'Test di Applicazioni', description: 'Testa i flussi di registrazione degli utenti senza ingombrare la tua casella di posta principale.' }, { title: 'Evita lo Spam', description: 'Mantieni pulita la tua email principale utilizzando indirizzi temporanei per le iscrizioni.' }, { title: 'Protezione della Privacy', description: 'Mantieni l\'anonimato quando accedi a servizi che richiedono la verifica via email.' }, { title: 'Test per Sviluppatori', description: 'Testa in sicurezza la funzionalità email nelle tue applicazioni.' }, { title: 'Account Social Media', description: 'Crea account social media temporanei senza esporre la tua vera email.' } ],
    blogPostsContent: [ { title: 'La Guida Definitiva alla Privacy delle Email nel 2025', excerpt: 'Scopri come proteggere la privacy delle tue email ed evitare lo spam con indirizzi email temporanei.' }, { title: '10 Consigli di Sicurezza per lo Shopping Online', excerpt: 'Fai acquisti online in sicurezza con queste pratiche di sicurezza essenziali.' }, { title: 'Come gli Sviluppatori Usano le Email Temporanee per i Test', excerpt: 'Scopri perché le email temporanee sono strumenti essenziali per gli sviluppatori di applicazioni.' } ],
    popularTopicsList: ['Privacy Email', 'Sicurezza Online', 'Strumenti per Sviluppatori', 'Anti-Spam', 'Identità Digitale']
  },
  pt: {
    home: 'Início', useCases: 'Casos de Uso', blog: 'Blog', tempEmail: 'E-mail Temporário', generateEmail: 'Gerar Novo E-mail', copyEmail: 'Copiar E-mail', copied: 'Copiado!', expiresIn: 'Expira em', extendExpiration: 'Estender Expiração', newEmail: 'Novo E-mail', customizeEmail: 'Personalizar E-mail', chooseDomain: 'Escolher Domínio', setExpiration: 'Definir Expiração', inbox: 'Caixa de Entrada', noEmails: 'Nenhum e-mail ainda', searchEmails: 'Pesquisar e-mails...', addMailbox: 'Adicionar Caixa', whyUseTempEmail: 'Por que usar um e-mail temporário?', useCasesIntro: 'Descubra as várias maneiras pelas quais os endereços de e-mail temporários podem proteger sua privacidade e melhorar sua experiência online.', blogTitle: 'Artigos Recentes', blogIntro: 'Mantenha-se informado sobre privacidade de e-mail, dicas de segurança e as últimas atualizações em tecnologia de e-mail temporário.', readMore: 'Leia Mais', popularTopics: 'Tópicos Populares', privacyPolicy: 'Política de Privacidade', dataNotStored: 'Seus dados nunca são armazenados permanentemente. Todos os e-mails temporários são excluídos automaticamente após a expiração.', feedback: 'Feedback', sendFeedback: 'Enviar Feedback', feedbackPlaceholder: 'Compartilhe suas ideias e sugestões...', thankYou: 'Obrigado pelo seu feedback!', usernamePlaceholder: 'nomedeusuario', adSlotText: 'Espaço Publicitário', expired: 'Expirado', viewFeedback: 'Ver Feedback', submittedFeedback: 'Feedback Enviado', noFeedbackYet: 'Nenhum feedback ainda.',
    expirationOptions: [ { label: '10 minutos' }, { label: '30 minutos' }, { label: '1 hora' }, { label: '6 horas' }, { label: '1 dia' }, { label: '1 semana' } ],
    useCasesContent: [ { title: 'Compras Online', description: 'Proteja seu e-mail principal de spam promocional ao fazer compras online.' }, { title: 'Teste de Aplicações', description: 'Teste fluxos de registro de usuários sem sobrecarregar sua caixa de entrada principal.' }, { title: 'Evite Spam', description: 'Mantenha seu e-mail principal limpo usando endereços temporários para cadastros.' }, { title: 'Proteção de Privacidade', description: 'Mantenha o anonimato ao acessar serviços que exigem verificação por e-mail.' }, { title: 'Teste para Desenvolvedores', description: 'Teste a funcionalidade de e-mail em seus aplicativos com segurança.' }, { title: 'Contas de Mídia Social', description: 'Crie contas de mídia social temporárias sem expor seu e-mail real.' } ],
    blogPostsContent: [ { title: 'O Guia Definitivo para a Privacidade de E-mail em 2025', excerpt: 'Aprenda a proteger sua privacidade de e-mail e evitar spam com endereços de e-mail temporários.' }, { title: '10 Dicas de Segurança para Compras Online', excerpt: 'Fique seguro ao fazer compras online com estas práticas de segurança essenciais.' }, { title: 'Como os Desenvolvedores Usam E-mails Temporários para Testes', excerpt: 'Descubra por que os e-mails temporários são ferramentas essenciais para desenvolvedores de aplicativos.' } ],
    popularTopicsList: ['Privacidade de E-mail', 'Segurança Online', 'Ferramentas de Desenvolvedor', 'Anti-Spam', 'Identidade Digital']
  },
  ru: {
    home: 'Главная', useCases: 'Случаи использования', blog: 'Блог', tempEmail: 'Временная почта', generateEmail: 'Создать новый ящик', copyEmail: 'Копировать', copied: 'Скопировано!', expiresIn: 'Истекает через', extendExpiration: 'Продлить', newEmail: 'Новый ящик', customizeEmail: 'Настроить', chooseDomain: 'Выбрать домен', setExpiration: 'Установить срок', inbox: 'Входящие', noEmails: 'Писем пока нет', searchEmails: 'Поиск писем...', addMailbox: 'Добавить ящик', whyUseTempEmail: 'Зачем использовать временную почту?', useCasesIntro: 'Узнайте, как временные адреса электронной почты могут защитить вашу конфиденциальность и улучшить ваш онлайн-опыт.', blogTitle: 'Последние статьи', blogIntro: 'Будьте в курсе вопросов конфиденциальности электронной почты, советов по безопасности и последних обновлений в технологии временной почты.', readMore: 'Читать далее', popularTopics: 'Популярные темы', privacyPolicy: 'Политика конфиденциальности', dataNotStored: 'Ваши данные никогда не хранятся постоянно. Все временные электронные письма автоматически удаляются по истечении срока их действия.', feedback: 'Обратная связь', sendFeedback: 'Отправить отзыв', feedbackPlaceholder: 'Поделитесь своими мыслями и предложениями...', thankYou: 'Спасибо за ваш отзыв!', usernamePlaceholder: 'имяпользователя', adSlotText: 'Рекламное место', expired: 'Истекло', viewFeedback: 'Просмотреть отзывы', submittedFeedback: 'Отправленные отзывы', noFeedbackYet: 'Пока нет отзывов.',
    expirationOptions: [ { label: '10 минут' }, { label: '30 минут' }, { label: '1 час' }, { label: '6 часов' }, { label: '1 день' }, { label: '1 неделя' } ],
    useCasesContent: [ { title: 'Онлайн-покупки', description: 'Защитите свою основную почту от рекламного спама при совершении покупок в Интернете.' }, { title: 'Тестирование приложений', description: 'Тестируйте процессы регистрации пользователей, не загромождая свой основной почтовый ящик.' }, { title: 'Избегайте спама', description: 'Держите свою основную почту в чистоте, используя временные адреса для регистраций.' }, { title: 'Защита конфиденциальности', description: 'Сохраняйте анонимность при доступе к службам, требующим подтверждения по электронной почте.' }, { title: 'Тестирование для разработчиков', description: 'Безопасно тестируйте функциональность электронной почты в своих приложениях.' }, { title: 'Аккаунты в социальных сетях', description: 'Создавайте временные учетные записи в социальных сетях, не раскрывая свою настоящую электронную почту.' } ],
    blogPostsContent: [ { title: 'Полное руководство по конфиденциальности электронной почты в 2025 году', excerpt: 'Узнайте, как защитить конфиденциальность своей электронной почты и избежать спама с помощью временных адресов электронной почты.' }, { title: '10 советов по безопасности при совершении покупок в Интернете', excerpt: 'Оставайтесь в безопасности при совершении покупок в Интернете с помощью этих основных правил безопасности.' }, { title: 'Как разработчики используют временные электронные письма для тестирования', excerpt: 'Узнайте, почему временные электронные письма являются важными инструментами для разработчиков приложений.' } ],
    popularTopicsList: ['Конфиденциальность почты', 'Безопасность в сети', 'Инструменты разработчика', 'Анти-спам', 'Цифровая личность']
  },
  zh: {
    home: '首页', useCases: '使用案例', blog: '博客', tempEmail: '临时邮箱', generateEmail: '生成新邮箱', copyEmail: '复制邮箱', copied: '已复制！', expiresIn: '有效期至', extendExpiration: '延长有效期', newEmail: '新邮箱', customizeEmail: '自定义邮箱', chooseDomain: '选择域名', setExpiration: '设置有效期', inbox: '收件箱', noEmails: '暂无邮件', searchEmails: '搜索邮件...', addMailbox: '添加邮箱', whyUseTempEmail: '为什么使用临时邮箱？', useCasesIntro: '了解临时电子邮件地址如何保护您的隐私并改善您的在线体验。', blogTitle: '最新文章', blogIntro: '随时了解电子邮件隐私、安全提示以及临时电子邮件技术的最新动态。', readMore: '阅读更多', popularTopics: '热门话题', privacyPolicy: '隐私政策', dataNotStored: '您的数据永远不会被永久存储。所有临时电子邮件都将在过期后自动删除。', feedback: '反馈', sendFeedback: '发送反馈', feedbackPlaceholder: '分享您的想法和建议...', thankYou: '感谢您的反馈！', usernamePlaceholder: '用户名', adSlotText: '广告位', expired: '已过期', viewFeedback: '查看反馈', submittedFeedback: '已提交的反馈', noFeedbackYet: '暂无反馈。',
    expirationOptions: [ { label: '10 分钟' }, { label: '30 分钟' }, { label: '1 小时' }, { label: '6 小时' }, { label: '1 天' }, { label: '1 周' } ],
    useCasesContent: [ { title: '在线购物', description: '在网上购物时，保护您的主电子邮件免受促销垃圾邮件的骚扰。' }, { title: '应用程序测试', description: '测试用户注册流程，而不会弄乱您的主收件箱。' }, { title: '避免垃圾邮件', description: '使用临时地址进行注册，保持您的主电子邮件清洁。' }, { title: '隐私保护', description: '在访问需要电子邮件验证的服务时保持匿名。' }, { title: '开发人员测试', description: '在您的应用程序中安全地测试电子邮件功能。' }, { title: '社交媒体帐户', description: '创建临时社交媒体帐户，而无需暴露您的真实电子邮件。' } ],
    blogPostsContent: [ { title: '2025 年电子邮件隐私终极指南', excerpt: '了解如何使用临时电子邮件地址保护您的电子邮件隐私并避免垃圾邮件。' }, { title: '10 个网上购物安全提示', excerpt: '通过这些基本的安全措施，在网上购物时保持安全。' }, { title: '开发人员如何使用临时电子邮件进行测试', excerpt: '了解为什么临时电子邮件是应用程序开发人员的重要工具。' } ],
    popularTopicsList: ['邮件隐私', '在线安全', '开发者工具', '反垃圾邮件', '数字身份']
  },
  ja: {
    home: 'ホーム', useCases: '使用例', blog: 'ブログ', tempEmail: '一時メール', generateEmail: '新しいメールを生成', copyEmail: 'メールをコピー', copied: 'コピーしました！', expiresIn: '有効期限', extendExpiration: '期限を延長', newEmail: '新しいメール', customizeEmail: 'メールをカスタマイズ', chooseDomain: 'ドメインを選択', setExpiration: '有効期限を設定', inbox: '受信トレイ', noEmails: 'まだメールはありません', searchEmails: 'メールを検索...', addMailbox: 'メールボックスを追加', whyUseTempEmail: 'なぜ一時的なメールを使用するのか？', useCasesIntro: '一時的なメールアドレスがあなたのプライバシーを保護し、オンライン体験を向上させるさまざまな方法をご覧ください。', blogTitle: '最新記事', blogIntro: 'メールのプライバシー、セキュリティのヒント、一時的なメール技術の最新情報について常に情報を得てください。', readMore: '続きを読む', popularTopics: '人気のトピック', privacyPolicy: 'プライバシーポリシー', dataNotStored: 'あなたのデータが永久に保存されることはありません。すべての一時的なメールは有効期限が切れると自動的に削除されます。', feedback: 'フィードバック', sendFeedback: 'フィードバックを送信', feedbackPlaceholder: 'ご意見やご提案をお聞かせください...', thankYou: 'フィードバックありがとうございます！', usernamePlaceholder: 'ユーザー名', adSlotText: '広告スペース', expired: '期限切れ', viewFeedback: 'フィードバックを見る', submittedFeedback: '送信されたフィードバック', noFeedbackYet: 'まだフィードバックはありません。',
    expirationOptions: [ { label: '10分' }, { label: '30分' }, { label: '1時間' }, { label: '6時間' }, { label: '1日' }, { label: '1週間' } ],
    useCasesContent: [ { title: 'オンラインショッピング', description: 'オンラインショッピングの際に、プロモーションスパムからメインのメールを保護します。' }, { title: 'アプリケーションのテスト', description: 'メインの受信トレイを散らかさずにユーザー登録フローをテストします。' }, { title: 'スパムを避ける', description: '登録に一時的なアドレスを使用して、メインのメールをきれいに保ちます。' }, { title: 'プライバシー保護', description: 'メール認証が必要なサービスにアクセスする際に匿名性を維持します。' }, { title: '開発者向けテスト', description: 'アプリケーションのメール機能を安全にテストします。' }, { title: 'ソーシャルメディアアカウント', description: '実際のメールを公開せずに一時的なソーシャルメディアアカウントを作成します。' } ],
    blogPostsContent: [ { title: '2025年のメールプライバシー究極ガイド', excerpt: '一時的なメールアドレスでメールのプライバシーを保護し、スパムを回避する方法を学びます。' }, { title: 'オンラインショッピングのための10のセキュリティヒント', excerpt: 'これらの基本的なセキュリティ対策でオンラインショッピングを安全に行いましょう。' }, { title: '開発者がテストに一時的なメールを使用する方法', excerpt: '一時的なメールがアプリケーション開発者にとって不可欠なツールである理由をご覧ください。' } ],
    popularTopicsList: ['メールプライバシー', 'オンラインセキュリティ', '開発者ツール', 'スパム対策', 'デジタルID']
  },
  ko: {
    home: '홈', useCases: '사용 사례', blog: '블로그', tempEmail: '임시 이메일', generateEmail: '새 이메일 생성', copyEmail: '이메일 복사', copied: '복사됨!', expiresIn: '만료 기한', extendExpiration: '기한 연장', newEmail: '새 이메일', customizeEmail: '이메일 맞춤 설정', chooseDomain: '도메인 선택', setExpiration: '만료 기한 설정', inbox: '받은 편지함', noEmails: '아직 이메일 없음', searchEmails: '이메일 검색...', addMailbox: '사서함 추가', whyUseTempEmail: '임시 이메일을 사용하는 이유', useCasesIntro: '임시 이메일 주소가 개인 정보를 보호하고 온라인 경험을 개선하는 다양한 방법을 알아보세요.', blogTitle: '최신 기사', blogIntro: '이메일 개인 정보 보호, 보안 팁 및 임시 이메일 기술의 최신 업데이트에 대한 정보를 얻으십시오.', readMore: '더 읽기', popularTopics: '인기 주제', privacyPolicy: '개인정보 처리방침', dataNotStored: '귀하의 데이터는 영구적으로 저장되지 않습니다. 모든 임시 이메일은 만료 후 자동으로 삭제됩니다.', feedback: '피드백', sendFeedback: '피드백 보내기', feedbackPlaceholder: '생각과 제안을 공유해주세요...', thankYou: '피드백 감사합니다!', usernamePlaceholder: '사용자이름', adSlotText: '광고 공간', expired: '만료됨', viewFeedback: '피드백 보기', submittedFeedback: '제출된 피드백', noFeedbackYet: '아직 피드백이 없습니다.',
    expirationOptions: [ { label: '10분' }, { label: '30분' }, { label: '1시간' }, { label: '6시간' }, { label: '1일' }, { label: '1주일' } ],
    useCasesContent: [ { title: '온라인 쇼핑', description: '온라인 쇼핑 시 홍보성 스팸으로부터 기본 이메일을 보호하세요.' }, { title: '애플리케이션 테스트', description: '기본 받은 편지함을 어지럽히지 않고 사용자 등록 흐름을 테스트하세요.' }, { title: '스팸 방지', description: '가입 시 임시 주소를 사용하여 기본 이메일을 깨끗하게 유지하세요.' }, { title: '개인 정보 보호', description: '이메일 인증이 필요한 서비스에 액세스할 때 익명성을 유지하세요.' }, { title: '개발자 테스트', description: '애플리케이션에서 이메일 기능을 안전하게 테스트하세요.' }, { title: '소셜 미디어 계정', description: '실제 이메일을 노출하지 않고 임시 소셜 미디어 계정을 만드세요.' } ],
    blogPostsContent: [ { title: '2025년 이메일 개인 정보 보호 최종 가이드', excerpt: '임시 이메일 주소로 이메일 개인 정보를 보호하고 스팸을 피하는 방법을 알아보세요.' }, { title: '온라인 쇼핑을 위한 10가지 보안 팁', excerpt: '이러한 필수 보안 관행으로 온라인 쇼핑 시 안전을 유지하세요.' }, { title: '개발자가 테스트에 임시 이메일을 사용하는 방법', excerpt: '임시 이메일이 애플리케이션 개발자에게 필수적인 도구인 이유를 알아보세요.' } ],
    popularTopicsList: ['이메일 개인정보', '온라인 보안', '개발자 도구', '스팸 방지', '디지털 신원']
  },
  ar: {
    home: 'الرئيسية', useCases: 'حالات الاستخدام', blog: 'المدونة', tempEmail: 'بريد مؤقت', generateEmail: 'إنشاء بريد جديد', copyEmail: 'نسخ البريد', copied: 'تم النسخ!', expiresIn: 'ينتهي في', extendExpiration: 'تمديد الصلاحية', newEmail: 'بريد جديد', customizeEmail: 'تخصيص البريد', chooseDomain: 'اختر نطاقًا', setExpiration: 'تحديد الصلاحية', inbox: 'صندوق الوارد', noEmails: 'لا توجد رسائل بعد', searchEmails: 'البحث في الرسائل...', addMailbox: 'إضافة صندوق بريد', whyUseTempEmail: 'لماذا تستخدم بريدًا مؤقتًا؟', useCasesIntro: 'اكتشف الطرق المختلفة التي يمكن بها لعناوين البريد الإلكتروني المؤقتة حماية خصوصيتك وتحسين تجربتك عبر الإنترنت.', blogTitle: 'أحدث المقالات', blogIntro: 'ابق على اطلاع بخصوص خصوصية البريد الإلكتروني ونصائح الأمان وآخر التحديثات في تقنية البريد الإلكتروني المؤقت.', readMore: 'اقرأ المزيد', popularTopics: 'مواضيع شائعة', privacyPolicy: 'سياسة الخصوصية', dataNotStored: 'لا يتم تخزين بياناتك بشكل دائم أبدًا. يتم حذف جميع رسائل البريد الإلكتروني المؤقتة تلقائيًا بعد انتهاء صلاحيتها.', feedback: 'ملاحظات', sendFeedback: 'إرسال ملاحظات', feedbackPlaceholder: 'شارك بأفكارك واقتراحاتك...', thankYou: 'شكرا لملاحظاتك!', usernamePlaceholder: 'اسم المستخدم', adSlotText: 'مساحة إعلانية', expired: 'منتهي الصلاحية', viewFeedback: 'عرض الملاحظات', submittedFeedback: 'الملاحظات المقدمة', noFeedbackYet: 'لا توجد ملاحظات حتى الآن.',
    expirationOptions: [ { label: '10 دقائق' }, { label: '30 دقيقة' }, { label: 'ساعة واحدة' }, { label: '6 ساعات' }, { label: 'يوم واحد' }, { label: 'أسبوع واحد' } ],
    useCasesContent: [ { title: 'التسوق عبر الإنترنت', description: 'احمِ بريدك الإلكتروني الأساسي من البريد العشوائي الترويجي عند التسوق عبر الإنترنت.' }, { title: 'اختبار التطبيقات', description: 'اختبر تدفقات تسجيل المستخدمين دون ازدحام صندوق الوارد الرئيسي.' }, { title: 'تجنب البريد العشوائي', description: 'حافظ على نظافة بريدك الإلكتروني الرئيسي باستخدام عناوين مؤقتة للتسجيلات.' }, { title: 'حماية الخصوصية', description: 'حافظ على سرية هويتك عند الوصول إلى الخدمات التي تتطلب التحقق من البريد الإلكتروني.' }, { title: 'اختبار المطورين', description: 'اختبر وظائف البريد الإلكتروني في تطبيقاتك بأمان.' }, { title: 'حسابات وسائل التواصل الاجتماعي', description: 'أنشئ حسابات وسائط اجتماعية مؤقتة دون الكشف عن بريدك الإلكتروني الحقيقي.' } ],
    blogPostsContent: [ { title: 'الدليل النهائي لخصوصية البريد الإلكتروني في عام 2025', excerpt: 'تعلم كيفية حماية خصوصية بريدك الإلكتروني وتجنب البريد العشوائي باستخدام عناوين بريد إلكتروني مؤقتة.' }, { title: '10 نصائح أمنية للتسوق عبر الإنترنت', excerpt: 'ابق آمنًا أثناء التسوق عبر الإنترنت مع هذه الممارسات الأمنية الأساسية.' }, { title: 'كيف يستخدم المطورون رسائل البريد الإلكتروني المؤقتة للاختبار', excerpt: 'اكتشف لماذا تعد رسائل البريد الإلكتروني المؤقتة أدوات أساسية لمطوري التطبيقات.' } ],
    popularTopicsList: ['خصوصية البريد', 'الأمان عبر الإنترنت', 'أدوات المطورين', 'مكافحة البريد العشوائي', 'الهوية الرقمية']
  },
  hi: {
    home: 'होम', useCases: 'उपयोग के मामले', blog: 'ब्लॉग', tempEmail: 'अस्थायी ईमेल', generateEmail: 'नया ईमेल बनाएं', copyEmail: 'ईमेल कॉपी करें', copied: 'कॉपी किया गया!', expiresIn: 'में समाप्त होता है', extendExpiration: 'समाप्ति बढ़ाएँ', newEmail: 'नया ईमेल', customizeEmail: 'ईमेल अनुकूलित करें', chooseDomain: 'डोमेन चुनें', setExpiration: 'समाप्ति सेट करें', inbox: 'इनबॉक्स', noEmails: 'अभी तक कोई ईमेल नहीं', searchEmails: 'ईमेल खोजें...', addMailbox: 'मेलबॉक्स जोड़ें', whyUseTempEmail: 'अस्थायी ईमेल का उपयोग क्यों करें?', useCasesIntro: 'अस्थायी ईमेल पते आपकी गोपनीयता की रक्षा कैसे कर सकते हैं और आपके ऑनलाइन अनुभव को बेहतर बना सकते हैं, इसके विभिन्न तरीकों की खोज करें।', blogTitle: 'नवीनतम लेख', blogIntro: 'ईमेल गोपनीयता, सुरक्षा युक्तियों और अस्थायी ईमेल प्रौद्योगिकी में नवीनतम अपडेट के बारे में सूचित रहें।', readMore: 'और पढ़ें', popularTopics: 'लोकप्रिय विषय', privacyPolicy: 'गोपनीयता नीति', dataNotStored: 'आपका डेटा कभी भी स्थायी रूप से संग्रहीत नहीं किया जाता है। सभी अस्थायी ईमेल समाप्ति के बाद स्वचालित रूप से हटा दिए जाते हैं।', feedback: 'प्रतिक्रिया', sendFeedback: 'प्रतिक्रिया भेजें', feedbackPlaceholder: 'अपने विचार और सुझाव साझा करें...', thankYou: 'आपकी प्रतिक्रिया के लिए धन्यवाद!', usernamePlaceholder: 'उपयोगकर्ता नाम', adSlotText: 'विज्ञापन स्लॉट', expired: 'समय सीमा समाप्त', viewFeedback: 'प्रतिक्रिया देखें', submittedFeedback: 'प्रस्तुत प्रतिक्रिया', noFeedbackYet: 'अभी तक कोई प्रतिक्रिया नहीं।',
    expirationOptions: [ { label: '10 मिनट' }, { label: '30 मिनट' }, { label: '1 घंटा' }, { label: '6 घंटे' }, { label: '1 दिन' }, { label: '1 सप्ताह' } ],
    useCasesContent: [ { title: 'ऑनलाइन शॉपिंग', description: 'ऑनलाइन शॉपिंग करते समय अपने प्राथमिक ईमेल को प्रचार स्पैम से बचाएं।' }, { title: 'एप्लिकेशन परीक्षण', description: 'अपने मुख्य इनबॉक्स को अव्यवस्थित किए बिना उपयोगकर्ता पंजीकरण प्रवाह का परीक्षण करें।' }, { title: 'स्पैम से बचें', description: 'साइनअप के लिए अस्थायी पते का उपयोग करके अपना मुख्य ईमेल साफ रखें।' }, { title: 'गोपनीयता संरक्षण', description: 'ईमेल सत्यापन की आवश्यकता वाली सेवाओं तक पहुँचते समय गुमनामी बनाए रखें।' }, { title: 'डेवलपर परीक्षण', description: 'अपने अनुप्रयोगों में ईमेल কার্যকারিতা सुरक्षित रूप से परीक्षण करें।' }, { title: 'सोशल मीडिया खाते', description: 'अपना वास्तविक ईमेल उजागर किए बिना अस्थायी सोशल मीडिया खाते बनाएं।' } ],
    blogPostsContent: [ { title: '2025 में ईमेल गोपनीयता के लिए अंतिम गाइड', excerpt: 'अस्थायी ईमेल पते के साथ अपनी ईमेल गोपनीयता की रक्षा करना और स्पैम से बचना सीखें।' }, { title: 'ऑनलाइन शॉपिंग के लिए 10 सुरक्षा युक्तियाँ', excerpt: 'इन आवश्यक सुरक्षा प्रथाओं के साथ ऑनलाइन शॉपिंग करते समय सुरक्षित रहें।' }, { title: 'डेवलपर्स परीक्षण के लिए अस्थायी ईमेल का उपयोग कैसे करते हैं', excerpt: 'जानें कि अस्थायी ईमेल एप्लिकेशन डेवलपर्स के लिए आवश्यक उपकरण क्यों हैं।' } ],
    popularTopicsList: ['ईमेल गोपनीयता', 'ऑनलाइन सुरक्षा', 'डेवलपर उपकरण', 'एंटी-स्पैम', 'डिजिटल पहचान']
  },
  bn: {
    home: 'হোম', useCases: 'ব্যবহারের ক্ষেত্র', blog: 'ব্লগ', tempEmail: 'অস্থায়ী ইমেল', generateEmail: 'নতুন ইমেল তৈরি করুন', copyEmail: 'ইমেল অনুলিপি করুন', copied: 'অনুলিপি করা হয়েছে!', expiresIn: 'মেয়াদ শেষ হবে', extendExpiration: 'মেয়াদ বাড়ান', newEmail: 'নতুন ইমেল', customizeEmail: 'ইমেল কাস্টমাইজ করুন', chooseDomain: 'ডোমেন চয়ন করুন', setExpiration: 'মেয়াদ নির্ধারণ করুন', inbox: 'ইনবক্স', noEmails: 'এখনও কোন ইমেল নেই', searchEmails: 'ইমেল অনুসন্ধান করুন...', addMailbox: 'মেলবক্স যুক্ত করুন', whyUseTempEmail: 'কেন অস্থায়ী ইমেল ব্যবহার করবেন?', useCasesIntro: 'অস্থায়ী ইমেল ঠিকানাগুলি কীভাবে আপনার গোপনীয়তা রক্ষা করতে এবং আপনার অনলাইন অভিজ্ঞতা উন্নত করতে পারে তার বিভিন্ন উপায় আবিষ্কার করুন।', blogTitle: 'সর্বশেষ নিবন্ধ', blogIntro: 'ইমেল গোপনীয়তা, সুরক্ষা টিপস এবং অস্থায়ী ইমেল প্রযুক্তির সর্বশেষ আপডেট সম্পর্কে অবগত থাকুন।', readMore: 'আরও পড়ুন', popularTopics: 'জনপ্রিয় বিষয়', privacyPolicy: 'গোপনীয়তা নীতি', dataNotStored: 'আপনার ডেটা কখনও স্থায়ীভাবে সংরক্ষণ করা হয় না। সমস্ত অস্থায়ী ইমেল মেয়াদ শেষ হওয়ার পরে স্বয়ংক্রিয়ভাবে মুছে ফেলা হয়।', feedback: 'মতামত', sendFeedback: 'মতামত পাঠান', feedbackPlaceholder: 'আপনার চিন্তাভাবনা এবং পরামর্শ শেয়ার করুন...', thankYou: 'আপনার মতামতের জন্য ধন্যবাদ!', usernamePlaceholder: 'ব্যবহারকারীর নাম', adSlotText: 'বিজ্ঞাপনের স্থান', expired: 'মেয়াদোত্তীর্ণ', viewFeedback: 'মতামত দেখুন', submittedFeedback: 'জমা দেওয়া মতামত', noFeedbackYet: 'এখনও কোন মতামত নেই।',
    expirationOptions: [ { label: '১০ মিনিট' }, { label: '৩০ মিনিট' }, { label: '১ ঘন্টা' }, { label: '৬ ঘন্টা' }, { label: '১ দিন' }, { label: '১ সপ্তাহ' } ],
    useCasesContent: [ { title: 'অনলাইন কেনাকাটা', description: 'অনলাইনে কেনাকাটা করার সময় আপনার প্রাথমিক ইমেল প্রচারমূলক স্প্যাম থেকে রক্ষা করুন।' }, { title: 'অ্যাপ্লিকেশন পরীক্ষা', description: 'আপনার প্রধান ইনবক্সকে বিশৃঙ্খল না করে ব্যবহারকারী নিবন্ধন প্রবাহ পরীক্ষা করুন।' }, { title: 'স্প্যাম এড়িয়ে চলুন', description: 'সাইনআপের জন্য অস্থায়ী ঠিকানা ব্যবহার করে আপনার প্রধান ইমেল পরিষ্কার রাখুন।' }, { title: 'গোপনীয়তা সুরক্ষা', description: 'ইমেল যাচাইকরণের প্রয়োজন এমন পরিষেবাগুলি অ্যাক্সেস করার সময় বেনামী বজায় রাখুন।' }, { title: 'ডেভেলপার পরীক্ষা', description: 'আপনার অ্যাপ্লিকেশনগুলিতে নিরাপদে ইমেল কার্যকারিতা পরীক্ষা করুন।' }, { title: 'সোশ্যাল মিডিয়া অ্যাকাউন্ট', description: 'আপনার আসল ইমেল প্রকাশ না করে অস্থায়ী সোশ্যাল মিডিয়া অ্যাকাউন্ট তৈরি করুন।' } ],
    blogPostsContent: [ { title: '২০২৫ সালে ইমেল গোপনীয়তার চূড়ান্ত গাইড', excerpt: 'অস্থায়ী ইমেল ঠিকানা দিয়ে কীভাবে আপনার ইমেল গোপনীয়তা রক্ষা করবেন এবং স্প্যাম এড়াবেন তা শিখুন।' }, { title: 'অনলাইন কেনাকাটার জন্য ১০টি সুরক্ষা টিপস', excerpt: 'এই প্রয়োজনীয় সুরক্ষা অভ্যাসগুলির সাথে অনলাইনে কেনাকাটা করার সময় নিরাপদ থাকুন।' }, { title: 'ডেভেলপাররা পরীক্ষার জন্য কীভাবে অস্থায়ী ইমেল ব্যবহার করে', excerpt: 'কেন অস্থায়ী ইমেল অ্যাপ্লিকেশন ডেভেলপারদের জন্য অপরিহার্য সরঞ্জাম তা আবিষ্কার করুন।' } ],
    popularTopicsList: ['ইমেল গোপনীয়তা', 'অনলাইন সুরক্ষা', 'ডেভেলপার সরঞ্জাম', 'অ্যান্টি-স্প্যাম', 'ডিজিটাল পরিচয়']
  },
  id: {
    home: 'Beranda', useCases: 'Kasus Penggunaan', blog: 'Blog', tempEmail: 'Email Sementara', generateEmail: 'Buat Email Baru', copyEmail: 'Salin Email', copied: 'Disalin!', expiresIn: 'Kedaluwarsa dalam', extendExpiration: 'Perpanjang Kedaluwarsa', newEmail: 'Email Baru', customizeEmail: 'Sesuaikan Email', chooseDomain: 'Pilih Domain', setExpiration: 'Atur Kedaluwarsa', inbox: 'Kotak Masuk', noEmails: 'Belum ada email', searchEmails: 'Cari email...', addMailbox: 'Tambah Kotak Surat', whyUseTempEmail: 'Mengapa menggunakan email sementara?', useCasesIntro: 'Temukan berbagai cara alamat email sementara dapat melindungi privasi Anda dan meningkatkan pengalaman online Anda.', blogTitle: 'Artikel Terbaru', blogIntro: 'Tetap terinformasi tentang privasi email, tips keamanan, dan pembaruan terbaru dalam teknologi email sementara.', readMore: 'Baca Selengkapnya', popularTopics: 'Topik Populer', privacyPolicy: 'Kebijakan Privasi', dataNotStored: 'Data Anda tidak pernah disimpan secara permanen. Semua email sementara dihapus secara otomatis setelah kedaluwarsa.', feedback: 'Umpan Balik', sendFeedback: 'Kirim Umpan Balik', feedbackPlaceholder: 'Bagikan pemikiran dan saran Anda...', thankYou: 'Terima kasih atas umpan balik Anda!', usernamePlaceholder: 'nama pengguna', adSlotText: 'Slot Iklan', expired: 'Kedaluwarsa', viewFeedback: 'Lihat Umpan Balik', submittedFeedback: 'Umpan Balik Terkirim', noFeedbackYet: 'Belum ada umpan balik.',
    expirationOptions: [ { label: '10 menit' }, { label: '30 menit' }, { label: '1 jam' }, { label: '6 jam' }, { label: '1 hari' }, { label: '1 minggu' } ],
    useCasesContent: [ { title: 'Belanja Online', description: 'Lindungi email utama Anda dari spam promosi saat berbelanja online.' }, { title: 'Pengujian Aplikasi', description: 'Uji alur pendaftaran pengguna tanpa mengacaukan kotak masuk utama Anda.' }, { title: 'Hindari Spam', description: 'Jaga kebersihan email utama Anda dengan menggunakan alamat sementara untuk pendaftaran.' }, { title: 'Perlindungan Privasi', description: 'Pertahankan anonimitas saat mengakses layanan yang memerlukan verifikasi email.' }, { title: 'Pengujian Pengembang', description: 'Uji fungsionalitas email di aplikasi Anda dengan aman.' }, { title: 'Akun Media Sosial', description: 'Buat akun media sosial sementara tanpa mengekspos email asli Anda.' } ],
    blogPostsContent: [ { title: 'Panduan Utama Privasi Email di Tahun 2025', excerpt: 'Pelajari cara melindungi privasi email Anda dan menghindari spam dengan alamat email sementara.' }, { title: '10 Tips Keamanan untuk Belanja Online', excerpt: 'Tetap aman saat berbelanja online dengan praktik keamanan penting ini.' }, { title: 'Bagaimana Pengembang Menggunakan Email Sementara untuk Pengujian', excerpt: 'Temukan mengapa email sementara adalah alat penting bagi pengembang aplikasi.' } ],
    popularTopicsList: ['Privasi Email', 'Keamanan Online', 'Alat Pengembang', 'Anti-Spam', 'Identitas Digital']
  }
};

const languages: Language[] = [
  { code: 'en', name: 'English', flag: '🇺🇸', locale: 'en-US' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷', locale: 'tr-TR' },
  { code: 'es', name: 'Español', flag: '🇪🇸', locale: 'es-ES' },
  { code: 'fr', name: 'Français', flag: '🇫🇷', locale: 'fr-FR' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪', locale: 'de-DE' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹', locale: 'it-IT' },
  { code: 'pt', name: 'Português', flag: '🇵🇹', locale: 'pt-PT' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺', locale: 'ru-RU' },
  { code: 'zh', name: '中文', flag: '🇨🇳', locale: 'zh-CN' },
  { code: 'ja', name: '日本語', flag: '🇯🇵', locale: 'ja-JP' },
  { code: 'ko', name: '한국어', flag: '🇰🇷', locale: 'ko-KR' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦', locale: 'ar-SA' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳', locale: 'hi-IN' },
  { code: 'bn', name: 'বাংলা', flag: '🇧🇩', locale: 'bn-BD' },
  { code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩', locale: 'id-ID' }
];

const domains = [
  'tempmail.dev',
  'disposablemail.com',
  'temp-mail.org',
  'guerrillamail.com',
  '10minutemail.com'
];

const staticExpirationOptions = [
  { value: 10, unit: 'minutes' },
  { value: 30, unit: 'minutes' },
  { value: 60, unit: 'minutes' },
  { value: 360, unit: 'minutes' },
  { value: 1440, unit: 'minutes' },
  { value: 10080, unit: 'minutes' }
];

const staticBlogPosts = [
  {
    id: 1,
    image: 'https://images.pexels.com/photos/4439901/pexels-photo-4439901.jpeg?auto=compress&cs=tinysrgb&w=800',
    date: '2025-01-15'
  },
  {
    id: 2,
    image: 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=800',
    date: '2025-01-12'
  },
  {
    id: 3,
    image: 'https://images.pexels.com/photos/574077/pexels-photo-574077.jpeg?auto=compress&cs=tinysrgb&w=800',
    date: '2025-01-10'
  }
];

const useCaseIcons = [
    { icon: ShoppingCart, color: 'text-green-600' },
    { icon: Code, color: 'text-blue-600' },
    { icon: Shield, color: 'text-red-600' },
    { icon: Eye, color: 'text-purple-600' },
    { icon: Zap, color: 'text-yellow-600' },
    { icon: Users, color: 'text-pink-600' }
];

// Navigasyon Bileşeni
const Navigation = ({
  theme,
  t,
  currentPage,
  setCurrentPage,
  language,
  setLanguage,
  showLanguageDropdown,
  setShowLanguageDropdown,
  toggleTheme,
  mobileMenuOpen,
  setMobileMenuOpen
}) => (
  <nav className={`sticky top-0 z-50 ${theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} border-b backdrop-blur-lg bg-opacity-95`}>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-16">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <Mail className="h-8 w-8 text-blue-600" />
          <span className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            TempMail
          </span>
        </div>

        {/* Masaüstü Navigasyon */}
        <div className="hidden md:flex items-center space-x-8">
          <button
            onClick={() => setCurrentPage('home')}
            className={`${currentPage === 'home' ? 'text-blue-600' : theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} hover:text-blue-600 transition-colors`}
          >
            {t('home')}
          </button>
          <button
            onClick={() => setCurrentPage('useCases')}
            className={`${currentPage === 'useCases' ? 'text-blue-600' : theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} hover:text-blue-600 transition-colors`}
          >
            {t('useCases')}
          </button>
          <button
            onClick={() => setCurrentPage('blog')}
            className={`${currentPage === 'blog' ? 'text-blue-600' : theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} hover:text-blue-600 transition-colors`}
          >
            {t('blog')}
          </button>
        </div>

        {/* Eylemler */}
        <div className="flex items-center space-x-4">
          {/* Dil Seçici */}
          <div className="relative">
            <button
              onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
              className={`flex items-center space-x-1 px-3 py-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-600'} transition-colors`}
            >
              <Globe className="h-4 w-4" />
              <span className="text-sm">{languages.find(l => l.code === language)?.flag}</span>
              <ChevronDown className="h-4 w-4" />
            </button>
            
            {showLanguageDropdown && (
              <div className={`absolute right-0 mt-2 w-48 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg shadow-lg max-h-64 overflow-y-auto z-50`}>
                {languages.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                      setShowLanguageDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-2 flex items-center space-x-2 ${theme === 'dark' ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-50 text-gray-700'} transition-colors`}
                  >
                    <span>{lang.flag}</span>
                    <span className="text-sm">{lang.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Tema Değiştirici */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-600'} transition-colors`}
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          {/* Mobil Menü Butonu */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`md:hidden p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-600'} transition-colors`}
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Mobil Navigasyon */}
      {mobileMenuOpen && (
        <div className={`md:hidden border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} py-4`}>
          <div className="flex flex-col space-y-2">
            <button
              onClick={() => {
                setCurrentPage('home');
                setMobileMenuOpen(false);
              }}
              className={`text-left px-4 py-2 ${currentPage === 'home' ? 'text-blue-600' : theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} hover:text-blue-600 transition-colors`}
            >
              {t('home')}
            </button>
            <button
              onClick={() => {
                setCurrentPage('useCases');
                setMobileMenuOpen(false);
              }}
              className={`text-left px-4 py-2 ${currentPage === 'useCases' ? 'text-blue-600' : theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} hover:text-blue-600 transition-colors`}
            >
              {t('useCases')}
            </button>
            <button
              onClick={() => {
                setCurrentPage('blog');
                setMobileMenuOpen(false);
              }}
              className={`text-left px-4 py-2 ${currentPage === 'blog' ? 'text-blue-600' : theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} hover:text-blue-600 transition-colors`}
            >
              {t('blog')}
            </button>
          </div>
        </div>
      )}
    </div>
  </nav>
);

// Reklam Alanı Bileşeni
const AdSlot = ({ theme, t, className = "", size = "banner" }: { theme: Theme, t: (key: string) => string, className?: string, size?: "banner" | "square" | "skyscraper" }) => {
  const sizeClasses = {
    banner: "h-24 w-full",
    square: "h-64 w-64",
    skyscraper: "h-96 w-32"
  };

  return (
    <div className={`${sizeClasses[size]} ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-300'} border-2 border-dashed flex items-center justify-center rounded-lg ${className}`}>
      <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{t('adSlotText')}</span>
    </div>
  );
};

// Ana Sayfa Bileşeni
const HomePage = ({
  theme, t, tempEmails, setTempEmails, activeEmailIndex, setActiveEmailIndex,
  createTempEmail, copiedEmail, copyToClipboard, formatTimeRemaining,
  selectedExpiration, setSelectedExpiration, customUsername, setCustomUsername,
  selectedDomain, setSelectedDomain, searchQuery, setSearchQuery, notifications,
  requestNotificationPermission, filteredEmails, toggleEmailRead,
  toggleEmailStar, deleteEmail, feedbackText, setFeedbackText,
  feedbackSent, sendFeedback, expirationOptions, language,
  showFeedbackModal, setShowFeedbackModal
}) => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Ana E-posta Bölümü */}
      <div className="lg:col-span-2 space-y-6">
        {/* E-posta Oluşturucu */}
        <div className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border p-6 shadow-lg`}>
          <h2 className={`text-2xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {t('tempEmail')}
          </h2>
          
          {/* Aktif E-posta Sekmeleri */}
          <div className="flex flex-wrap gap-2 mb-6">
            {tempEmails.map((email, index) => (
              <div
                key={email.id}
                onClick={() => setActiveEmailIndex(index)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  activeEmailIndex === index
                    ? 'bg-blue-600 text-white'
                    : theme === 'dark' 
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Mail className="h-4 w-4" />
                <span className="truncate max-w-32">{email.address.split('@')[0]}</span>
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    if (tempEmails.length > 1) {
                      setTempEmails(prev => prev.filter((_, i) => i !== index));
                      setActiveEmailIndex(prevIndex => {
                          if (index === prevIndex) return Math.max(0, prevIndex - 1);
                          if (index < prevIndex) return prevIndex - 1;
                          return prevIndex;
                      });
                    }
                  }}
                  className="hover:bg-black hover:bg-opacity-20 rounded-full p-1"
                >
                  <X className="h-3 w-3" />
                </span>
              </div>
            ))}
            
            <button
              onClick={() => createTempEmail()}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium border-2 border-dashed transition-colors ${
                theme === 'dark'
                  ? 'border-gray-600 text-gray-400 hover:border-gray-500 hover:text-gray-300'
                  : 'border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-700'
              }`}
            >
              <Plus className="h-4 w-4" />
              <span>{t('addMailbox')}</span>
            </button>
          </div>

          {tempEmails[activeEmailIndex] && (
            <>
              {/* Mevcut E-posta Gösterimi */}
              <div className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4 mb-6`}>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <span className={`text-lg font-mono break-all ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {tempEmails[activeEmailIndex].address}
                  </span>
                  <button
                    onClick={() => copyToClipboard(tempEmails[activeEmailIndex].address)}
                    className="flex items-center space-x-2 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex-shrink-0"
                  >
                    {copiedEmail === tempEmails[activeEmailIndex].address ? (
                      <>
                        <Check className="h-4 w-4" />
                        <span className="text-sm">{t('copied')}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        <span className="text-sm">{t('copyEmail')}</span>
                      </>
                    )}
                  </button>
                </div>
                
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center space-x-2 text-sm">
                    <Clock className="h-4 w-4 text-orange-500" />
                    <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                      {t('expiresIn')}: {formatTimeRemaining(tempEmails[activeEmailIndex].expiresAt)}
                    </span>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setTempEmails(prev => prev.map((email, index) => 
                          index === activeEmailIndex 
                            ? { ...email, expiresAt: new Date(Date.now() + selectedExpiration.value * 60 * 1000) }
                            : email
                        ));
                      }}
                      className={`px-3 py-1 text-sm rounded-lg border transition-colors ${
                        theme === 'dark'
                          ? 'border-gray-600 text-gray-300 hover:bg-gray-600'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {t('extendExpiration')}
                    </button>
                    <button
                      onClick={() => createTempEmail()}
                      className="px-3 py-1 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      {t('newEmail')}
                    </button>
                  </div>
                </div>
              </div>

              {/* E-posta Özelleştirme */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    {t('customizeEmail')}
                  </label>
                  <input
                    type="text"
                    value={customUsername}
                    onChange={(e) => setCustomUsername(e.target.value)}
                    placeholder={t('usernamePlaceholder')}
                    className={`w-full px-3 py-2 rounded-lg border ${
                      theme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  />
                </div>
                
                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    {t('chooseDomain')}
                  </label>
                  <select
                    value={selectedDomain}
                    onChange={(e) => setSelectedDomain(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border ${
                      theme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  >
                    {domains.map(domain => (
                      <option key={domain} value={domain}>@{domain}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    {t('setExpiration')}
                  </label>
                  <select
                    value={selectedExpiration.value}
                    onChange={(e) => {
                      const option = expirationOptions.find(opt => opt.value === parseInt(e.target.value));
                      if (option) setSelectedExpiration(option);
                    }}
                    className={`w-full px-3 py-2 rounded-lg border ${
                      theme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  >
                    {expirationOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Gelen Kutusu */}
        <div className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border p-6 shadow-lg`}>
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {t('inbox')}
            </h2>
            
            <div className="flex items-center space-x-4">
              {/* Arama */}
              <div className="relative">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('searchEmails')}
                  className={`pl-10 pr-4 py-2 rounded-lg border ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                />
              </div>
              
              {/* Bildirimleri Aç/Kapa */}
              <button
                onClick={requestNotificationPermission}
                className={`p-2 rounded-lg transition-colors ${
                  notifications
                    ? 'bg-blue-600 text-white'
                    : theme === 'dark'
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Bell className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* E-posta Listesi */}
          <div className="space-y-3">
            {filteredEmails.length === 0 ? (
              <div className={`text-center py-12 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>{t('noEmails')}</p>
              </div>
            ) : (
              filteredEmails.map(email => (
                <div
                  key={email.id}
                  className={`${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'} rounded-lg p-4 transition-colors cursor-pointer ${
                    !email.isRead ? 'border-l-4 border-blue-600' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'} ${!email.isRead ? 'font-bold' : ''}`}>
                          {email.from}
                        </span>
                        {email.isStarred && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                        <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          {email.timestamp.toLocaleTimeString(languages.find(l => l.code === language)?.locale || 'en-US')}
                        </span>
                      </div>
                      <h3 className={`font-medium mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'} ${!email.isRead ? 'font-bold' : ''}`}>
                        {email.subject}
                      </h3>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} line-clamp-2`}>
                        {email.content}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => toggleEmailRead(email.id)}
                        className={`p-1 rounded hover:bg-opacity-20 hover:bg-gray-500 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}
                      >
                        {email.isRead ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={() => toggleEmailStar(email.id)}
                        className={`p-1 rounded hover:bg-opacity-20 hover:bg-gray-500 ${email.isStarred ? 'text-yellow-500' : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}
                      >
                        <Star className={`h-4 w-4 ${email.isStarred ? 'fill-current' : ''}`} />
                      </button>
                      <button
                        onClick={() => deleteEmail(email.id)}
                        className={`p-1 rounded hover:bg-opacity-20 hover:bg-red-500 ${theme === 'dark' ? 'text-gray-400 hover:text-red-400' : 'text-gray-500 hover:text-red-500'}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Kenar Çubuğu */}
      <div className="space-y-6">
        {/* Reklam Alanı */}
        <AdSlot theme={theme} t={t} size="square" />
        
        {/* Gizlilik Notu */}
        <div className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border p-6 shadow-lg`}>
          <div className="flex items-center space-x-2 mb-4">
            <Shield className="h-5 w-5 text-green-600" />
            <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {t('privacyPolicy')}
            </h3>
          </div>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            {t('dataNotStored')}
          </p>
        </div>

        {/* Geri Bildirim Formu */}
        <div className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border p-6 shadow-lg`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {t('feedback')}
            </h3>
            <button onClick={() => setShowFeedbackModal(true)} className="text-sm text-blue-600 hover:underline">{t('viewFeedback')}</button>
          </div>
          {feedbackSent ? (
            <div className="flex items-center space-x-2 text-green-600">
              <Check className="h-5 w-5" />
              <span>{t('thankYou')}</span>
            </div>
          ) : (
            <div className="space-y-4">
              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder={t('feedbackPlaceholder')}
                rows={4}
                className={`w-full px-3 py-2 rounded-lg border ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none`}
              />
              <button
                onClick={sendFeedback}
                disabled={!feedbackText.trim()}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="h-4 w-4" />
                <span>{t('sendFeedback')}</span>
              </button>
            </div>
          )}
        </div>

        {/* Reklam Alanı */}
        <AdSlot theme={theme} t={t} />
      </div>
    </div>
  </div>
);

// Kullanım Alanları Sayfa Bileşeni
const UseCasesPage = ({ theme, t, useCases }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16">
        <h1 className={`text-4xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          {t('whyUseTempEmail')}
        </h1>
        <p className={`text-xl ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} max-w-3xl mx-auto`}>
          {t('useCasesIntro')}
        </p>
      </div>

      {/* Reklam Alanı */}
      <AdSlot theme={theme} t={t} className="mb-12" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {useCases.map((useCase, index) => {
          const IconComponent = useCase.icon;
          return (
            <div
              key={index}
              className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border p-8 shadow-lg hover:shadow-xl transition-shadow`}
            >
              <div className={`inline-flex p-3 rounded-lg bg-opacity-10 ${useCase.color.replace('text-', 'bg-')} mb-6`}>
                <IconComponent className={`h-8 w-8 ${useCase.color}`} />
              </div>
              <h3 className={`text-xl font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {useCase.title}
              </h3>
              <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} leading-relaxed`}>
                {useCase.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Reklam Alanı */}
      <AdSlot theme={theme} t={t} className="mt-12" />
    </div>
  );
};

// Blog Sayfa Bileşeni
const BlogPage = ({ theme, t, blogPosts, popularTopics, language }) => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div className="text-center mb-16">
      <h1 className={`text-4xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
        {t('blogTitle')}
      </h1>
      <p className={`text-xl ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} max-w-3xl mx-auto`}>
        {t('blogIntro')}
      </p>
    </div>

    {/* Reklam Alanı */}
    <AdSlot theme={theme} t={t} className="mb-12" />

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <div className="space-y-8">
          {blogPosts.map(post => (
            <article
              key={post.id}
              className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border overflow-hidden shadow-lg hover:shadow-xl transition-shadow`}
            >
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-64 object-cover"
                onError={(e) => { e.currentTarget.src = 'https://placehold.co/800x400/cccccc/ffffff?text=Görsel+Yüklenemedi'; }}
              />
              <div className="p-8">
                <div className="flex items-center space-x-4 mb-4">
                  <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    {new Date(post.date).toLocaleDateString(languages.find(l => l.code === language)?.locale || 'en-US')}
                  </span>
                </div>
                <h2 className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {post.title}
                </h2>
                <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-6 leading-relaxed`}>
                  {post.excerpt}
                </p>
                <button className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium">
                  <span>{t('readMore')}</span>
                  <ChevronDown className="h-4 w-4 rotate-[-90deg]" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        {/* Reklam Alanı */}
        <AdSlot theme={theme} t={t} size="square" />
        
        {/* Popüler Konular */}
        <div className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border p-6 shadow-lg`}>
          <h3 className={`font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {t('popularTopics')}
          </h3>
          <div className="space-y-2">
            {popularTopics.map(topic => (
              <button
                key={topic}
                className={`block w-full text-left px-3 py-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-50 text-gray-700'} transition-colors`}
              >
                {topic}
              </button>
            ))}
          </div>
        </div>

        {/* Reklam Alanı */}
        <AdSlot theme={theme} t={t} />
      </div>
    </div>
  </div>
);

const FeedbackModal = ({ show, onClose, feedbackList, theme, t, language }) => {
    if (!show) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white'} rounded-lg p-6 shadow-xl w-full max-w-lg max-h-[80vh] flex flex-col`}>
          <div className="flex justify-between items-center mb-4 flex-shrink-0">
            <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{t('submittedFeedback')}</h3>
            <button onClick={onClose} className={`p-1 rounded-full ${theme === 'dark' ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-200'}`}>
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="overflow-y-auto">
            {feedbackList.length === 0 ? (
              <p className={`text-center py-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{t('noFeedbackYet')}</p>
            ) : (
              <div className="space-y-4">
                {feedbackList.map((feedback, index) => (
                  <div key={index} className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} p-3 rounded-lg`}>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-800'}`}>{feedback.text}</p>
                    <p className={`text-xs text-right mt-2 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                      {feedback.date.toLocaleString(languages.find(l => l.code === language)?.locale || 'en-US')}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
};

function App() {
  // State yönetimi
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [theme, setTheme] = useState<Theme>('light');
  const [language, setLanguage] = useState('tr');
  const [tempEmails, setTempEmails] = useState<TempEmail[]>([]);
  const [activeEmailIndex, setActiveEmailIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [customUsername, setCustomUsername] = useState('');
  const [selectedDomain, setSelectedDomain] = useState(domains[0]);
  const [selectedExpiration, setSelectedExpiration] = useState(staticExpirationOptions[0]);
  const [notifications, setNotifications] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState('');
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  // Zamanlayıcı için useEffect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Çeviri fonksiyonları
  const t = useCallback((key: string): string => {
    const langTranslations = translations[language as keyof typeof translations];
    const enTranslations = translations.en;
    return (langTranslations && langTranslations[key]) || enTranslations[key] || key;
  }, [language]);

  const t_array = useCallback((key: string): any[] => {
      const langTranslations = translations[language as keyof typeof translations];
      const enTranslations = translations.en;
      return (langTranslations && langTranslations[key]) || enTranslations[key] || [];
  }, [language]);

  // Rastgele e-posta oluştur
  const generateRandomEmail = useCallback(() => {
    const randomString = Math.random().toString(36).substring(2, 15);
    const username = customUsername || `user${randomString}`;
    return `${username}@${selectedDomain}`;
  }, [customUsername, selectedDomain]);

  // Yeni geçici e-posta oluştur
  const createTempEmail = useCallback(() => {
    const newEmail: TempEmail = {
      id: Date.now().toString(),
      address: generateRandomEmail(),
      expiresAt: new Date(Date.now() + selectedExpiration.value * 60 * 1000),
      emails: [],
      isActive: true
    };
    
    setTempEmails(prev => {
        setActiveEmailIndex(prev.length);
        return [...prev, newEmail];
    });
    
    setTimeout(() => {
      const mockEmail: Email = {
        id: Date.now().toString(),
        from: 'welcome@example.com',
        subject: 'Hoş geldiniz! Geçici e-postanız hazır',
        content: 'Geçici e-posta adresiniz oluşturuldu ve mesaj almaya hazır.',
        timestamp: new Date(),
        isRead: false,
        isStarred: false,
        labels: [],
        isDeleted: false
      };
      
      setTempEmails(prev => prev.map(email => 
        email.id === newEmail.id 
          ? { ...email, emails: [...email.emails, mockEmail] }
          : email
      ));
      
      if (notifications && 'Notification' in window && Notification.permission === 'granted') {
        new Notification('Yeni E-posta Alındı', {
          body: `Gönderen: ${mockEmail.from}\nKonu: ${mockEmail.subject}`,
          icon: '/vite.svg'
        });
      }
    }, 2000);
  }, [generateRandomEmail, selectedExpiration, notifications]);

  // İlk e-posta ile başlat
  useEffect(() => {
    if (tempEmails.length === 0) {
      createTempEmail();
    }
  }, [createTempEmail, tempEmails.length]);

  // Panoya kopyala
  const copyToClipboard = (text: string) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = "fixed";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
        document.execCommand('copy');
        setCopiedEmail(text);
        setTimeout(() => setCopiedEmail(''), 2000);
    } catch (err) {
        console.error('Kopyalanamadı: ', err);
    }
    document.body.removeChild(textArea);
  };

  // Bildirim izni iste
  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotifications(permission === 'granted');
    }
  };

  // Temayı değiştir
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Kalan süreyi formatla
  const formatTimeRemaining = (expiresAt: Date) => {
    const diff = expiresAt.getTime() - currentTime.getTime();
    if (diff <= 0) return t('expired');
    const totalSeconds = Math.floor(diff / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  // E-postaları filtrele
  const filteredEmails = tempEmails[activeEmailIndex]?.emails?.filter(email => 
    !email.isDeleted &&
    (!searchQuery || 
      email.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.content.toLowerCase().includes(searchQuery.toLowerCase()))
  ) || [];

  // E-posta işlemleri
  const toggleEmailRead = (emailId: string) => {
    setTempEmails(prev => prev.map(tempEmail => ({
      ...tempEmail,
      emails: tempEmail.emails.map(email => 
        email.id === emailId ? { ...email, isRead: !email.isRead } : email
      )
    })));
  };

  const toggleEmailStar = (emailId: string) => {
    setTempEmails(prev => prev.map(tempEmail => ({
      ...tempEmail,
      emails: tempEmail.emails.map(email => 
        email.id === emailId ? { ...email, isStarred: !email.isStarred } : email
      )
    })));
  };

  const deleteEmail = (emailId: string) => {
    setTempEmails(prev => prev.map(tempEmail => ({
      ...tempEmail,
      emails: tempEmail.emails.map(email => 
        email.id === emailId ? { ...email, isDeleted: true } : email
      )
    })));
  };

  // Geri bildirim gönder
  const sendFeedback = () => {
    if (feedbackText.trim()) {
      setFeedbackList(prev => [...prev, { text: feedbackText, date: new Date() }]);
      setFeedbackSent(true);
      setFeedbackText('');
      setTimeout(() => setFeedbackSent(false), 3000);
    }
  };
  
  // Çevrilmiş verileri oluştur
  const expirationOptions = staticExpirationOptions.map((option, index) => ({
      ...option,
      label: t_array('expirationOptions')[index]?.label || ''
  }));

  const useCases = t_array('useCasesContent').map((content, index) => ({
      ...useCaseIcons[index],
      ...content
  }));

  const blogPosts = staticBlogPosts.map((post, index) => ({
      ...post,
      ...t_array('blogPostsContent')[index]
  }));
  
  const popularTopics = t_array('popularTopicsList');
  
  useEffect(() => {
    const currentSelection = expirationOptions.find(opt => opt.value === selectedExpiration.value);
    if(currentSelection) {
        setSelectedExpiration(currentSelection);
    }
  }, [language]);


  // Ana render
  return (
    <div className={`min-h-screen transition-colors ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-blue-50 via-purple-50 to-blue-50'
    }`}>
      <Navigation
        theme={theme}
        t={t}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        language={language}
        setLanguage={setLanguage}
        showLanguageDropdown={showLanguageDropdown}
        setShowLanguageDropdown={setShowLanguageDropdown}
        toggleTheme={toggleTheme}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />
      
      <main>
        {currentPage === 'home' && <HomePage 
          theme={theme} t={t} tempEmails={tempEmails} setTempEmails={setTempEmails}
          activeEmailIndex={activeEmailIndex} setActiveEmailIndex={setActiveEmailIndex}
          createTempEmail={createTempEmail} copiedEmail={copiedEmail} copyToClipboard={copyToClipboard}
          formatTimeRemaining={formatTimeRemaining} selectedExpiration={selectedExpiration}
          setSelectedExpiration={setSelectedExpiration} customUsername={customUsername}
          setCustomUsername={setCustomUsername} selectedDomain={selectedDomain}
          setSelectedDomain={setSelectedDomain} searchQuery={searchQuery} setSearchQuery={setSearchQuery}
          notifications={notifications} requestNotificationPermission={requestNotificationPermission}
          filteredEmails={filteredEmails} toggleEmailRead={toggleEmailRead}
          toggleEmailStar={toggleEmailStar} deleteEmail={deleteEmail}
          feedbackText={feedbackText} setFeedbackText={setFeedbackText}
          feedbackSent={feedbackSent} sendFeedback={sendFeedback}
          expirationOptions={expirationOptions} language={language}
          showFeedbackModal={showFeedbackModal} setShowFeedbackModal={setShowFeedbackModal}
        />}
        {currentPage === 'useCases' && <UseCasesPage theme={theme} t={t} useCases={useCases} />}
        {currentPage === 'blog' && <BlogPage theme={theme} t={t} blogPosts={blogPosts} popularTopics={popularTopics} language={language} />}
      </main>

      <FeedbackModal 
        show={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        feedbackList={feedbackList}
        theme={theme}
        t={t}
        language={language}
      />

      <footer className={`${theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} border-t mt-16`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Mail className="h-6 w-6 text-blue-600" />
              <span className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                TempMail
              </span>
            </div>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              © 2025 TempMail. {t('privacyPolicy')}.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
