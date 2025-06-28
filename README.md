# AI Terminal Shell 🚀

A powerful, AI-enhanced terminal application designed specifically for iPad, combining the functionality of a traditional terminal with intelligent AI assistance powered by Claude AI.

## 📱 Features

### 🖥️ Advanced Terminal Interface
- **Full Terminal Emulation**: Complete command-line interface with support for common Unix/Linux commands
- **Command History**: Navigate through previous commands with arrow keys
- **Smart Autocomplete**: AI-powered command suggestions and completions
- **Syntax Highlighting**: Color-coded output for better readability
- **iPad Optimized**: Responsive design that adapts to different iPad screen sizes

### 🤖 AI-Powered Assistant
- **Claude AI Integration**: Real-time assistance with terminal commands and system administration
- **Intelligent Command Analysis**: Get detailed explanations of complex commands
- **Script Generation**: AI can help write and optimize shell scripts
- **Security Auditing**: Advanced security analysis and recommendations
- **Multi-language Support**: Available in 10+ languages including English, Korean, Japanese, Chinese

### 🔐 SSH Connection Management
- **Multiple Connections**: Manage multiple SSH connections simultaneously
- **Key-based Authentication**: Support for SSH keys and certificates
- **Connection Profiles**: Save and organize server connections
- **Secure Storage**: Encrypted credential storage
- **Auto-reconnect**: Automatic reconnection to dropped connections

### ⚙️ Comprehensive Settings
- **Theme Customization**: Multiple terminal themes (Matrix Green, Cyberpunk Blue, etc.)
- **Font Configuration**: Customizable fonts with ligature support
- **Security Options**: Enhanced security features and biometric authentication
- **Data Management**: Export/import configurations and backup settings

## 🛠️ Technical Stack

- **Framework**: React Native with Expo SDK 52
- **Navigation**: Expo Router 4.0 with tab-based architecture
- **AI Integration**: Claude AI (Anthropic) API
- **Fonts**: Fira Code and Source Code Pro with Google Fonts
- **Icons**: Lucide React Native
- **Storage**: AsyncStorage for local data persistence
- **Platform**: Web-first with iOS/Android support

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Expo CLI
- Claude AI API key (for AI features)

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ai-terminal-shell.git
   cd ai-terminal-shell
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Claude AI API key:
   ```
   EXPO_PUBLIC_CLAUDE_API_KEY=your_claude_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

## 🔧 Configuration

### Claude AI Setup

1. Visit [Anthropic Console](https://console.anthropic.com/)
2. Create an account and generate an API key
3. Add the API key to your `.env` file
4. Restart the application

### iPad Optimization

The app is specifically optimized for iPad with:
- Responsive layouts that adapt to different screen sizes
- Touch-friendly interface elements
- Support for external keyboards
- Split-screen and multitasking compatibility

## 📱 Building for iPad

### Development Build

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
expo login

# Create development build
eas build --platform ios --profile development
```

### Production Build

```bash
# Build for App Store
eas build --platform ios --profile production

# Submit to App Store
eas submit --platform ios
```

## 🎯 Usage

### Basic Terminal Commands

The app supports a wide range of terminal commands:

```bash
# File operations
ls -la
cd /path/to/directory
cp file.txt backup.txt
mv old.txt new.txt

# System monitoring
ps aux
top
htop
df -h

# Network tools
ping google.com
curl https://api.example.com
ssh user@server.com
```

### AI Assistant

Ask the AI assistant for help with:

```
"Explain the rsync command"
"How to secure SSH configuration"
"Write a backup script"
"Analyze this error message"
```

### SSH Connections

1. Go to the Connections tab
2. Tap "Add Connection"
3. Enter server details (host, port, username)
4. Add SSH key if needed
5. Connect and start using the terminal

## 🔒 Security Features

- **Encrypted Storage**: All credentials are encrypted locally
- **Biometric Authentication**: Face ID/Touch ID support
- **Secure Mode**: Enhanced security validations
- **SSH Key Management**: Secure key generation and storage
- **Network Security**: SSL/TLS encryption for all communications

## 🌍 Internationalization

Supported languages:
- 🇺🇸 English
- 🇰🇷 Korean (한국어)
- 🇯🇵 Japanese (日本語)
- 🇨🇳 Chinese (中文)
- 🇪🇸 Spanish (Español)
- 🇫🇷 French (Français)
- 🇩🇪 German (Deutsch)
- 🇵🇹 Portuguese (Português)
- 🇷🇺 Russian (Русский)
- 🇸🇦 Arabic (العربية)

## 💰 Monetization

The app includes a freemium model with:

- **Free Tier**: Basic terminal functionality and limited AI queries
- **Pro Tier**: Unlimited AI assistance and advanced features
- **Enterprise Tier**: Team collaboration and custom integrations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Anthropic** for Claude AI API
- **Expo Team** for the excellent development framework
- **Lucide** for beautiful icons
- **Google Fonts** for typography
- **Open Source Community** for various libraries and tools

## 📞 Support

- **Documentation**: [Wiki](https://github.com/yourusername/ai-terminal-shell/wiki)
- **Issues**: [GitHub Issues](https://github.com/yourusername/ai-terminal-shell/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/ai-terminal-shell/discussions)
- **Email**: support@aiterminalshell.com

## 🗺️ Roadmap

- [ ] Apple Pencil support for annotations
- [ ] Vim/Nano editor integration
- [ ] File manager with drag & drop
- [ ] Terminal multiplexer (tmux) support
- [ ] Cloud sync for configurations
- [ ] Plugin system for extensions
- [ ] Voice commands integration
- [ ] Collaborative terminal sessions

---

**Made with ❤️ for developers who love the command line**
