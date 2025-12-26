$ErrorActionPreference = "Stop"
$mavenVersion = "3.9.6"
$mavenUrl = "https://archive.apache.org/dist/maven/maven-3/$mavenVersion/binaries/apache-maven-$mavenVersion-bin.zip"
$installDir = "$PSScriptRoot\.tools"
$mavenHome = "$installDir\apache-maven-$mavenVersion"

Write-Host "Checking for Maven..."

if (Test-Path "$mavenHome\bin\mvn.cmd") {
    Write-Host "Maven is already installed specifically for this project at: $mavenHome"
} else {
    Write-Host "Downloading Maven $mavenVersion..."
    if (-not (Test-Path $installDir)) { New-Item -ItemType Directory -Force -Path $installDir | Out-Null }
    
    $zipPath = "$installDir\maven.zip"
    Invoke-WebRequest -Uri $mavenUrl -OutFile $zipPath
    
    Write-Host "Extracting Maven..."
    Expand-Archive -Path $zipPath -DestinationPath $installDir -Force
    
    Remove-Item $zipPath
    Write-Host "Maven installed successfully."
}

# Output the path so we can use it
Write-Host "MAVEN_HOME=$mavenHome"
