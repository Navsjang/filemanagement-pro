/*
FileManagement Pro — Advanced C++ Interactive Demo
Features:
- Interactive terminal menu for topics
- Absolute vs Relative path tools (std::filesystem)
- Search operators (extension, prefix, contains)
- Organize files into system folders inside fm_demo/
- Path analyzer and converter
Build:
  g++ -std=c++17 filemanagement_pro_advanced.cpp -o filemanagement_pro_advanced
Run:
  ./filemanagement_pro_advanced
*/
#include <iostream>
#include <filesystem>
#include <vector>
#include <string>
#include <algorithm>
#include <fstream>

namespace fs = std::filesystem;
using namespace std;

void ensure_demo() {
    fs::path d = fs::current_path() / "fm_demo";
    fs::create_directories(d / "Downloads");
    fs::create_directories(d / "Documents" / "Notes");
    // create sample files if missing
    auto touch = [&](const fs::path &p){ if(!fs::exists(p)){ ofstream(p.string()); }};
    touch(d / "Downloads" / "photo1.jpg");
    touch(d / "Downloads" / "song1.mp3");
    touch(d / "Downloads" / "report_final.docx");
    touch(d / "Documents" / "Notes" / "meeting.txt");
}

void show_paths() {
    cout << "\n-- Absolute vs Relative Paths --\n";
    fs::path demo = fs::current_path() / "fm_demo" / "Documents" / "Notes" / "meeting.txt";
    cout << "Absolute: " << fs::absolute(demo) << "\n";
    cout << "Relative (to Documents): " << fs::relative(demo, fs::current_path() / "fm_demo" / "Documents") << "\n";
}

vector<fs::path> find_by_ext(const fs::path& dir, const string& ext) {
    vector<fs::path> out;
    if(!fs::exists(dir)) return out;
    for(auto &e : fs::recursive_directory_iterator(dir)) if(e.is_regular_file())
        if(e.path().extension()==ext) out.push_back(e.path());
    return out;
}

vector<fs::path> find_by_prefix(const fs::path& dir, const string& pre) {
    vector<fs::path> out;
    if(!fs::exists(dir)) return out;
    for(auto &e : fs::recursive_directory_iterator(dir)) if(e.is_regular_file()) {
        string name = e.path().filename().string();
        if(name.rfind(pre,0)==0) out.push_back(e.path());
    }
    return out;
}

vector<fs::path> find_by_contains(const fs::path& dir, const string& sub) {
    vector<fs::path> out;
    if(!fs::exists(dir)) return out;
    for(auto &e : fs::recursive_directory_iterator(dir)) if(e.is_regular_file()) {
        string name = e.path().filename().string();
        if(name.find(sub)!=string::npos) out.push_back(e.path());
    }
    return out;
}

void save_search(const string& name, const string& query) {
    fs::create_directories("fm_saved_searches");
    ofstream ofs(fs::path("fm_saved_searches") / (name + ".txt"));
    ofs << query << endl;
    cout << "Saved search '" << name << "'\n";
}

void list_saved_searches() {
    fs::path dir("fm_saved_searches");
    if(!fs::exists(dir)) { cout << "No saved searches.\n"; return; }
    for(auto &e: fs::directory_iterator(dir)) {
        cout << "- " << e.path().stem().string() << "\n";
    }
}

void organize_downloads() {
    fs::path dl = fs::current_path() / "fm_demo" / "Downloads";
    if(!fs::exists(dl)) { cout << "No Downloads folder.\n"; return; }
    vector<pair<fs::path, vector<string>>> mapping = {
        { dl / "Images", {".jpg", ".png", ".gif"} },
        { dl / "Documents", {".pdf", ".docx", ".txt"} },
        { dl / "Music", {".mp3", ".wav"} }
    };
    for(auto &m: mapping) fs::create_directories(m.first);
    for(auto &e : fs::directory_iterator(dl)) if(e.is_regular_file()) {
        for(auto &m: mapping) for(auto &ext: m.second) if(e.path().extension()==ext) {
            fs::path dest = m.first / e.path().filename();
            fs::rename(e.path(), dest);
            cout << "Moved " << e.path().filename() << " -> " << m.first << "\n";
        }
    }
    cout << "Organizing done.\n";
}

int main(){
    ensure_demo();
    cout << "Welcome to FileManagement Pro — C++ Interactive Demo\n";
    while(true){
        cout << "\nMenu:\n1) Paths demo\n2) Search demo\n3) Saved searches\n4) Organize Downloads\n5) Path Analyzer (convert between absolute/relative)\n0) Exit\nChoose: ";
        int c; if(!(cin>>c)) break;
        if(c==0) break;
        if(c==1) show_paths();
        else if(c==2){
            cout << "Enter extension to find (e.g. .docx): "; string ext; cin>>ext;
            auto res = find_by_ext(fs::current_path() / "fm_demo", ext);
            for(auto &p: res) cout << p << "\n";
        } else if(c==3){
            cout<<"a) save  b) list\nChoose: ";
            char ch; cin>>ch;
            if(ch=='a'){ string name, q; cout<<"Save name: "; cin>>name; cout<<"Query (e.g. ext:.docx contains:report): "; cin.ignore(); getline(cin,q); save_search(name,q);}
            else list_saved_searches();
        } else if(c==4) organize_downloads();
        else if(c==5){
            cout<<"Enter a path: "; string p; cin>>ws; getline(cin,p);
            fs::path input = p;
            cout<<"Absolute: "<<fs::absolute(input)<<"\n";
        } else cout<<"Unknown choice.\n";
    }
    cout<<"Goodbye.\n";
    return 0;
}
