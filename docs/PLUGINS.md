## Making new plugin
1. Create a new **.NET Core** class library. Recommended naming is **OCDPlugin.#PLUGINNAME#**.
2. Reference **OCDPluginInterface** project.
3. Open your project's .csproj file and edit **OCDPluginInterface** reference to include the following lines:
```
        <Private>false</Private>
        <ExcludeAssets>runtime</ExcludeAssets>
```
4. Add following line to any <PropertyGroup> tag of your project file: `<CopyLocalLockFileAssemblies>true</CopyLocalLockFileAssemblies>`
5. Create new class(es) implementing **IOCDCommand** interface.
6. Build your assembly and place it into its own subfolder in **plugins** folder of Open Control Deck.

For steps 3-4 refer to https://docs.microsoft.com/en-us/dotnet/core/tutorials/creating-app-with-plugin-support for additional help